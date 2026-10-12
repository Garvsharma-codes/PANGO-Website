import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateReviewSubmission, type Review, type ReviewSubmission } from "./lib/reviews";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
const reviews: Review[] = [];
const reviewRequests = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown"
  );
}

async function handleReviews(request: Request, env: unknown): Promise<Response> {
  if (request.method === "GET") {
    if (request.headers.has("x-admin-password")) {
      const password = request.headers.get("x-admin-password");
      const configuredPassword =
        (env as { REVIEW_ADMIN_PASSWORD?: string } | undefined)?.REVIEW_ADMIN_PASSWORD ??
        (
          globalThis as typeof globalThis & {
            process?: { env?: { REVIEW_ADMIN_PASSWORD?: string } };
          }
        ).process?.env?.REVIEW_ADMIN_PASSWORD;
      if (!configuredPassword || password !== configuredPassword) {
        return Response.json({ error: "Unauthorized." }, { status: 401 });
      }
      return Response.json(reviews);
    }
    return Response.json(reviews.filter((review) => review.status === "approved"));
  }

  if (request.method === "POST") {
    const ip = clientIp(request);
    const now = Date.now();
    const recent = (reviewRequests.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
    if (recent.length >= 3)
      return Response.json({ error: "Please try again later." }, { status: 429 });

    let input: ReviewSubmission;
    try {
      input = (await request.json()) as ReviewSubmission;
    } catch {
      return Response.json({ error: "Invalid review data." }, { status: 400 });
    }
    if (input.website) return Response.json({ error: "Invalid review data." }, { status: 400 });
    const error = validateReviewSubmission(input);
    if (error) return Response.json({ error }, { status: 400 });

    recent.push(now);
    reviewRequests.set(ip, recent);
    reviews.push({
      id: crypto.randomUUID(),
      name: input.name.trim(),
      companyOrCity: input.companyOrCity?.trim() || undefined,
      rating: input.rating,
      message: input.message.trim(),
      photo: input.photo?.trim() || undefined,
      date: new Date().toISOString(),
      status: "pending",
    });
    return Response.json({ ok: true }, { status: 201 });
  }

  const password = request.headers.get("x-admin-password");
  const configuredPassword =
    (env as { REVIEW_ADMIN_PASSWORD?: string } | undefined)?.REVIEW_ADMIN_PASSWORD ??
    (globalThis as typeof globalThis & { process?: { env?: { REVIEW_ADMIN_PASSWORD?: string } } })
      .process?.env?.REVIEW_ADMIN_PASSWORD;
  if (!configuredPassword || password !== configuredPassword) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (request.method === "PATCH") {
    const body = (await request.json()) as { id?: string; status?: Review["status"] };
    const review = reviews.find((item) => item.id === body.id);
    if (!review || !body.status || !["approved", "rejected", "pending"].includes(body.status)) {
      return Response.json({ error: "Invalid review update." }, { status: 400 });
    }
    review.status = body.status;
    return Response.json({ ok: true });
  }
  return Response.json(reviews);
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/reviews") return await handleReviews(request, env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
