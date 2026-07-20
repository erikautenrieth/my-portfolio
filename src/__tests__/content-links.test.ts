import { describe, it, expect } from "vitest";
import { GITHUB_URL, LINKEDIN_URL } from "@/content/links";

describe("content/links", () => {
  it("GITHUB_URL is a valid https URL", () => {
    expect(GITHUB_URL).toMatch(/^https:\/\/github\.com\//);
  });

  it("LINKEDIN_URL is a valid https URL", () => {
    expect(LINKEDIN_URL).toMatch(/^https:\/\/www\.linkedin\.com\//);
  });
});
