const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const APP_NAME = "SubTrack";
export const APP_TAGLINE = "Subscription Manager";

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Email is required";
  if (!isValidEmail(email)) return "Enter a valid email address";
  return null;
}

export function validatePassword(value: string, { minLength = 8 } = {}): string | null {
  if (!value) return "Password is required";
  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "Confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

export function validateName(value: string, label = "Name"): string | null {
  const name = value.trim();
  if (!name) return `${label} is required`;
  if (name.length < 2) return `${label} must be at least 2 characters`;
  return null;
}

export function validateCode(value: string): string | null {
  const code = value.trim();
  if (!code) return "Verification code is required";
  if (!/^\d{6}$/.test(code)) return "Enter the 6-digit code from your email";
  return null;
}

export function getFieldErrorMessage(
  fieldError?: { message?: string; longMessage?: string } | null,
): string | null {
  if (!fieldError) return null;
  return fieldError.longMessage || fieldError.message || null;
}

export function getGlobalErrorMessage(
  globalErrors?: { message?: string; longMessage?: string }[] | null,
): string | null {
  if (!globalErrors?.length) return null;
  const first = globalErrors[0];
  return first.longMessage || first.message || "Something went wrong. Please try again.";
}
