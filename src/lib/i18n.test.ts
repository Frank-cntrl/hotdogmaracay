import { describe, it, expect } from "vitest";
import { t } from "./i18n";

describe("t()", () => {
  it("returns Spanish value for the given key path", () => {
    expect(t("es", "hero.tagline")).toBe("Perros Venezolanos en Queens");
  });

  it("returns English value for the given key path", () => {
    expect(t("en", "hero.ctaOrder")).toBe("Order Now");
  });

  it("throws on missing keys (no silent fallback)", () => {
    expect(() => t("es", "hero.nonexistent")).toThrow(/missing translation/i);
  });
});
