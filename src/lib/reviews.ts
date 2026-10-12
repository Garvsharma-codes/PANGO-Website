export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  name: string;
  companyOrCity?: string;
  rating: number;
  message: string;
  photo?: string;
  date: string;
  status: ReviewStatus;
};

export type ReviewSubmission = {
  name: string;
  companyOrCity?: string;
  rating: number;
  message: string;
  photo?: string;
  website?: string;
};

export const REVIEW_MAX_MESSAGE_LENGTH = 500;

export function validateReviewSubmission(input: ReviewSubmission): string | null {
  if (!input.name.trim() || input.name.trim().length > 80) return "Please enter your name.";
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return "Please choose a rating from 1 to 5.";
  }
  if (!input.message.trim() || input.message.trim().length > REVIEW_MAX_MESSAGE_LENGTH) {
    return "Please enter a message of 500 characters or less.";
  }
  if (input.companyOrCity && input.companyOrCity.trim().length > 80) {
    return "Company or city must be 80 characters or less.";
  }
  return null;
}
