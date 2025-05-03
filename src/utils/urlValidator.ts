import { z } from "zod";

const URL_SCHEMA = z.string().url();

export interface URLValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateUrl(url: string): URLValidationResult {
  try {
    URL_SCHEMA.parse(url);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: "URL inválida"
    };
  }
}

export function isSecureUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function isAccessibleUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal
    })
      .then(() => resolve(true))
      .catch(() => resolve(false))
      .finally(() => clearTimeout(timeoutId));
  });
}

export async function validateDocumentUrl(url: string): Promise<URLValidationResult> {
  const basicValidation = validateUrl(url);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (!isSecureUrl(url)) {
    return {
      isValid: false,
      error: "URL deve usar HTTPS"
    };
  }

  const isAccessible = await isAccessibleUrl(url);
  if (!isAccessible) {
    return {
      isValid: false,
      error: "URL não está acessível"
    };
  }

  return { isValid: true };
} 