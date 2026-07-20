import { describe, it, expect } from "vitest";
import { skillCategories } from "@/content/skills";

describe("content/skills", () => {
  it("exports a non-empty array of categories", () => {
    expect(Array.isArray(skillCategories)).toBe(true);
    expect(skillCategories.length).toBeGreaterThan(0);
  });

  it("each category has bilingual labels", () => {
    for (const cat of skillCategories) {
      expect(cat.label.de).toBeTruthy();
      expect(cat.label.en).toBeTruthy();
    }
  });

  it("each category has at least one skill", () => {
    for (const cat of skillCategories) {
      expect(cat.skills.length).toBeGreaterThan(0);
    }
  });

  it("each skill has a non-empty name", () => {
    for (const cat of skillCategories) {
      for (const skill of cat.skills) {
        expect(typeof skill.name).toBe("string");
        expect(skill.name.length).toBeGreaterThan(0);
      }
    }
  });

  it("skill icon is a non-empty string when present", () => {
    for (const cat of skillCategories) {
      for (const skill of cat.skills) {
        if (skill.icon !== undefined) {
          expect(typeof skill.icon).toBe("string");
          expect(skill.icon.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("contains expected category labels in English", () => {
    const labels = skillCategories.map((c) => c.label.en);
    expect(labels).toContain("AI / LLMs / Agents");
    expect(labels).toContain("ML / Data Science");
    expect(labels).toContain("Backend");
    expect(labels).toContain("Frontend");
    expect(labels).toContain("Cloud & DevOps");
  });
});
