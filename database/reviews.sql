CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  company_or_city TEXT CHECK (company_or_city IS NULL OR char_length(company_or_city) <= 80),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS reviews_approved_created_at_idx
  ON reviews (approved, created_at DESC);
