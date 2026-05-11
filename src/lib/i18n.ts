import es from "../data/i18n/es.json";
import en from "../data/i18n/en.json";

export type Locale = "es" | "en";

const translations = { es, en } as const;

export function t(locale: Locale, key: string): string {
  const parts = key.split(".");
  let node: unknown = translations[locale];
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      throw new Error(`Missing translation for "${key}" in locale "${locale}"`);
    }
  }
  if (typeof node !== "string") {
    throw new Error(`Translation for "${key}" in "${locale}" is not a string`);
  }
  return node;
}

export const locales: Locale[] = ["es", "en"];
