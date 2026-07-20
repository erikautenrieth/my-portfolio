import { describe, it, expect } from "vitest";
import { projects } from "@/content/projects";

describe("content/projects", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project has bilingual title, problem, approach, result", () => {
    for (const p of projects) {
      expect(p.title.de).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.problem.de).toBeTruthy();
      expect(p.problem.en).toBeTruthy();
      expect(p.approach.de).toBeTruthy();
      expect(p.approach.en).toBeTruthy();
      expect(p.result.de).toBeTruthy();
      expect(p.result.en).toBeTruthy();
    }
  });

  it("each project has a non-empty tech array", () => {
    for (const p of projects) {
      expect(p.tech.length).toBeGreaterThan(0);
      for (const t of p.tech) {
        expect(typeof t).toBe("string");
        expect(t.length).toBeGreaterThan(0);
      }
    }
  });

  it("each project has a links object", () => {
    for (const p of projects) {
      expect(typeof p.links).toBe("object");
    }
  });

  it("link URLs are valid when present", () => {
    for (const p of projects) {
      const { demo, code, paper } = p.links;
      if (demo) expect(demo).toMatch(/^https?:\/\//);
      if (code) expect(code).toMatch(/^https?:\/\//);
      if (paper) expect(paper).toMatch(/^https?:\/\//);
    }
  });
});
