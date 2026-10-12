import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: Review[]) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  const average =
    reviews.length > 0
      ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14" aria-labelledby="reviews-title">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground/70">
          🌿 From our community
        </span>
        <h2 id="reviews-title" className="mt-2 font-display text-3xl text-primary md:text-4xl">
          Customer Reviews
        </h2>
        {reviews.length >= 3 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {average} from {reviews.length} customers
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-soft">
          <p className="font-display text-2xl text-primary">Be our first reviewer</p>
          <p className="mt-2 text-sm text-muted-foreground">Tried Pango? Tell us what you think.</p>
          <a
            href="#feedback"
            className="pill-btn mt-5 bg-primary px-6 py-3 text-sm text-primary-foreground"
          >
            Share your feedback
          </a>
        </div>
      ) : (
        <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="min-w-[min(86vw,22rem)] snap-start rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div
                className="flex items-center gap-1 text-accent-foreground"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < review.rating ? "fill-accent text-accent" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground">“{review.message}”</p>
              <div className="mt-5 flex items-center gap-3">
                {review.photo ? (
                  <img src={review.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/25 font-bold text-primary">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.companyOrCity ? `${review.companyOrCity} · ` : ""}
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
