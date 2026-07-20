import { describe, it, expect } from "vitest";
import { education } from "@/content/education";

describe("content/education", () => {
  it("exports a non-empty array", () => {
    expect(education.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    for (const entry of education) {
      expect(entry.period).toBeTruthy();
      expect(entry.degree.de).toBeTruthy();
      expect(entry.degree.en).toBeTruthy();
      expect(entry.institution).toBeTruthy();
      expect(entry.grade).toBeTruthy();
      expect(entry.thesis.de).toBeTruthy();
      expect(entry.thesis.en).toBeTruthy();
      expect(entry.thesisGrade).toBeTruthy();
    }
  });

  it("grades follow German format (digit,digit)", () => {
    const gradePattern = /^\d,\d$/;
    for (const entry of education) {
      expect(entry.grade).toMatch(gradePattern);
      expect(entry.thesisGrade).toMatch(gradePattern);
    }
  });
});
