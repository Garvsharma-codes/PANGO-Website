import { useState } from "react";
import { REVIEW_MAX_MESSAGE_LENGTH } from "@/lib/reviews";

const initialForm = { name: "", companyOrCity: "", rating: 0, message: "", photo: "" };

export function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.rating || !form.message.trim()) {
      setError("Please choose a star rating and write a message.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to submit feedback.");
      setSubmitted(true);
      setForm(initialForm);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to submit feedback.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="feedback" className="bg-cream-deep/60 py-16" aria-labelledby="feedback-title">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground/70">
            🌿 Your voice matters
          </span>
          <h2 id="feedback-title" className="mt-2 font-display text-3xl text-primary md:text-4xl">
            Share your feedback
          </h2>
        </div>
        {submitted ? (
          <div className="mt-8 rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-soft">
            <p className="font-display text-2xl text-primary">Thank you!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks! Your review will appear after approval.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 text-sm font-semibold text-primary underline"
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <div className="hidden" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Name *
                <input
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm font-medium">
                Company or city
                <input
                  maxLength={80}
                  value={form.companyOrCity}
                  onChange={(e) => setForm({ ...form, companyOrCity: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Star rating *</legend>
              <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Star rating">
                {Array.from({ length: 5 }, (_, index) => {
                  const rating = index + 1;
                  return (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === rating}
                      aria-label={`${rating} stars`}
                      onClick={() => setForm({ ...form, rating })}
                    >
                      <span
                        className={`text-2xl ${rating <= form.rating ? "text-accent" : "text-border"}`}
                      >
                        ★
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block text-sm font-medium">
              Message *
              <textarea
                required
                maxLength={REVIEW_MAX_MESSAGE_LENGTH}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
              <span className="mt-1 block text-right text-xs text-muted-foreground">
                {form.message.length}/{REVIEW_MAX_MESSAGE_LENGTH}
              </span>
            </label>
            <label className="block text-sm font-medium">
              Photo (optional)
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 1024) {
                    setError("Please choose an image smaller than 1 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () =>
                    setForm((current) => ({ ...current, photo: String(reader.result) }));
                  reader.readAsDataURL(file);
                }}
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              disabled={saving}
              className="pill-btn w-full bg-primary px-6 py-3.5 text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Sending..." : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
