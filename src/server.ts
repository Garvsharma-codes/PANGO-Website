import "./lib/error-capture";

import { neon } from "@neondatabase/serverless";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateReviewSubmission, type Review, type ReviewSubmission } from "./lib/reviews";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type RuntimeEnv = {
  DATABASE_URL?: string;
  POSTGRES_URL?: string;
  REVIEW_ADMIN_PASSWORD?: string;
};

type ReviewRow = {
  id: string;
  name: string;
  company_or_city: string | null;
  rating: number;
  message: string;
  photo: string | null;
  created_at: string;
  approved: boolean;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
const reviewRequests = new Map<string, number[]>();

function runtimeEnv(env: unknown): RuntimeEnv {
  const requestEnv = (env && typeof env === "object" ? env : {}) as RuntimeEnv;
  const processEnv = (
    globalThis as typeof globalThis & {
      process?: { env?: RuntimeEnv };
    }
  ).process?.env;
  const viteEnv = import.meta.env as Record<string, string | undefined>;

  return {
    DATABASE_URL:
      requestEnv.DATABASE_URL ??
      requestEnv.POSTGRES_URL ??
      processEnv?.DATABASE_URL ??
      processEnv?.POSTGRES_URL ??
      viteEnv.DATABASE_URL ??
      viteEnv.POSTGRES_URL,
    REVIEW_ADMIN_PASSWORD:
      requestEnv.REVIEW_ADMIN_PASSWORD ??
      processEnv?.REVIEW_ADMIN_PASSWORD ??
      viteEnv.REVIEW_ADMIN_PASSWORD,
  };
}

function getDatabase(env: unknown) {
  const databaseUrl = runtimeEnv(env).DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(databaseUrl);
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    companyOrCity: row.company_or_city ?? undefined,
    rating: row.rating,
    message: row.message,
    photo: row.photo ?? undefined,
    createdAt: row.created_at,
    approved: row.approved,
  };
}

function isAdmin(request: Request, env: unknown): boolean {
  const password = request.headers.get("x-admin-password");
  const configuredPassword = runtimeEnv(env).REVIEW_ADMIN_PASSWORD;
  return Boolean(configuredPassword && password && password === configuredPassword);
}

async function handleReviews(request: Request, env: unknown): Promise<Response> {
  const sql = getDatabase(env);

  if (request.method === "GET") {
    if (request.headers.has("x-admin-password") && !isAdmin(request, env)) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const rows = request.headers.has("x-admin-password")
      ? await sql<ReviewRow[]>`
          SELECT id, name, company_or_city, rating, message, photo, created_at, approved
          FROM reviews
          ORDER BY created_at DESC
        `
      : await sql<ReviewRow[]>`
          SELECT id, name, company_or_city, rating, message, photo, created_at, approved
          FROM reviews
          WHERE approved = TRUE
          ORDER BY created_at DESC
        `;

    return Response.json(rows.map(mapReview));
  }

  if (request.method === "POST") {
    const ip = clientIp(request);
    const now = Date.now();
    const recent = (reviewRequests.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
    if (recent.length >= 3) {
      return Response.json({ error: "Please try again later." }, { status: 429 });
    }

    let input: ReviewSubmission;
    try {
      input = (await request.json()) as ReviewSubmission;
    } catch {
      return Response.json({ error: "Invalid review data." }, { status: 400 });
    }
    if (input.website) {
      return Response.json({ error: "Invalid review data." }, { status: 400 });
    }

    const error = validateReviewSubmission(input);
    if (error) return Response.json({ error }, { status: 400 });

    await sql`
      INSERT INTO reviews (id, name, company_or_city, rating, message, photo, approved)
      VALUES (
        ${crypto.randomUUID()},
        ${input.name.trim()},
        ${input.companyOrCity?.trim() || null},
        ${input.rating},
        ${input.message.trim()},
        ${input.photo?.trim() || null},
        FALSE
      )
    `;
    recent.push(now);
    reviewRequests.set(ip, recent);
    return Response.json({ ok: true }, { status: 201 });
  }

  if (!isAdmin(request, env)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (request.method === "PATCH") {
    let body: { id?: string; approved?: boolean };
    try {
      body = (await request.json()) as { id?: string; approved?: boolean };
    } catch {
      return Response.json({ error: "Invalid review update." }, { status: 400 });
    }
    if (!body.id || typeof body.approved !== "boolean") {
      return Response.json({ error: "Invalid review update." }, { status: 400 });
    }

    const rows = await sql<ReviewRow[]>`
      UPDATE reviews
      SET approved = ${body.approved}
      WHERE id = ${body.id}
      RETURNING id, name, company_or_city, rating, message, photo, created_at, approved
    `;
    if (rows.length === 0) {
      return Response.json({ error: "Review not found." }, { status: 404 });
    }
    return Response.json(mapReview(rows[0]));
  }

  return Response.json({ error: "Method not allowed." }, { status: 405 });
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

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
      if (url.pathname === "/api/reviews") {
        try {
          return await handleReviews(request, env);
        } catch (error) {
          console.error("Review API error:", error);
          return Response.json({ error: "Review service unavailable." }, { status: 503 });
        }
      }
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
