import { describe, it, expect } from "vitest";
import { t, en, de, dict } from "@/i18n";
import type { Lang, Bilingual } from "@/i18n";

describe("i18n/t", () => {
  const bilingual: Bilingual = { de: "Hallo", en: "Hello" };

  it("returns English text for lang 'en'", () => {
    expect(t("en", bilingual)).toBe("Hello");
  });

  it("returns German text for lang 'de'", () => {
    expect(t("de", bilingual)).toBe("Hallo");
  });
});

describe("i18n/dict", () => {
  it("contains both 'en' and 'de' entries", () => {
    expect(dict).toHaveProperty("en");
    expect(dict).toHaveProperty("de");
  });

  it("maps to the exported en/de objects", () => {
    expect(dict.en).toBe(en);
    expect(dict.de).toBe(de);
  });
});

describe("i18n structural parity", () => {
  const collectKeys = (obj: Record<string, unknown>, prefix = ""): string[] => {
    const keys: string[] = [];
    for (const key of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        keys.push(...collectKeys(value as Record<string, unknown>, path));
      } else {
        keys.push(path);
      }
    }
    return keys.sort();
  };

  it("de and en dictionaries have the same keys", () => {
    const enKeys = collectKeys(en as unknown as Record<string, unknown>);
    const deKeys = collectKeys(de as unknown as Record<string, unknown>);
    expect(deKeys).toEqual(enKeys);
  });

  it("hero.titles arrays have the same length", () => {
    expect(de.hero.titles.length).toBe(en.hero.titles.length);
  });
});
