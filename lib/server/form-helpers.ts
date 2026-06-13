import { redirect } from "next/navigation";

export function parseCurrencyInput(value: unknown) {
  if (value === null || value === undefined) return 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  let cleaned = raw.replace(/[^0-9,.-]/g, "");

  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    cleaned = cleaned.replace(/\./g, "");
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getActionErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: Array<{ message?: string }> }).issues;
    const message = issues?.[0]?.message;
    if (message) return message;
  }

  if (error instanceof Error && error.message) return error.message;

  return "Action failed. Please check the input and try again.";
}

function buildRedirectUrl(path: string, key: "success" | "error", message: string) {
  const params = new URLSearchParams({ [key]: message });
  return `${path}?${params.toString()}`;
}

export function redirectSuccess(path: string, message: string): never {
  redirect(buildRedirectUrl(path, "success", message));
}

export function redirectError(path: string, error: unknown): never {
  redirect(buildRedirectUrl(path, "error", getActionErrorMessage(error)));
}
