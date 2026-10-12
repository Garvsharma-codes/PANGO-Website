import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Review } from "@/lib/reviews";

export const Route = createFileRoute("/admin/reviews")({ component: AdminReviewsPage });

function AdminReviewsPage() {
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  async function loadReviews() {
    const response = await fetch("/api/reviews", { headers: { "x-admin-password": password } });
    if (!response.ok) {
      setError("Password not accepted, or REVIEW_ADMIN_PASSWORD is not configured.");
      return;
    }
    setReviews((await response.json()) as Review[]);
    setError("");
  }

  async function updateReview(id: string, approved: boolean) {
    await fetch("/api/reviews", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id, approved }),
    });
    await loadReviews();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-display text-4xl text-primary">Review approvals</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the server-side REVIEW_ADMIN_PASSWORD to manage pending feedback.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="rounded-2xl border border-border bg-card px-4 py-3"
        />
        <button
          onClick={() => void loadReviews()}
          className="pill-btn bg-primary px-6 py-3 text-primary-foreground"
        >
          Load reviews
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {review.name} · {review.rating}/5
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{review.message}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {review.approved ? "approved" : "pending / rejected"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => void updateReview(review.id, true)}
                  className="pill-btn bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  Approve
                </button>
                <button
                  onClick={() => void updateReview(review.id, false)}
                  className="pill-btn border border-border px-4 py-2 text-sm"
                >
                  Reject / hide
                </button>
              </div>
            </div>
          </article>
        ))}
        {reviews.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
