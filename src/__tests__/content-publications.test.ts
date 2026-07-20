import { describe, it, expect } from "vitest";
import { publications } from "@/content/publications";

describe("content/publications", () => {
  it("exports a non-empty array", () => {
    expect(publications.length).toBeGreaterThan(0);
  });

  it("each publication has required fields", () => {
    for (const pub of publications) {
      expect(pub.authors).toBeTruthy();
      expect(pub.year).toBeGreaterThan(2000);
      expect(pub.title).toBeTruthy();
      expect(pub.venue).toBeTruthy();
      expect(pub.doi).toBeTruthy();
    }
  });

  it("DOIs follow expected format", () => {
    for (const pub of publications) {
      expect(pub.doi).toMatch(/^10\.\d{4,}/);
    }
  });
});
