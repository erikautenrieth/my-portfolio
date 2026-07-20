import { describe, it, expect } from "vitest";
import { experience } from "@/content/experience";

describe("content/experience", () => {
  it("exports a non-empty array", () => {
    expect(experience.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    for (const entry of experience) {
      expect(entry.period).toBeTruthy();
      expect(entry.role.de).toBeTruthy();
      expect(entry.role.en).toBeTruthy();
      expect(entry.company).toBeTruthy();
    }
  });

  it("each entry has bullets or projects (not neither)", () => {
    for (const entry of experience) {
      const hasBullets = Array.isArray(entry.bullets) && entry.bullets.length > 0;
      const hasProjects = Array.isArray(entry.projects) && entry.projects.length > 0;
      expect(hasBullets || hasProjects).toBe(true);
    }
  });

  it("project bullets are bilingual", () => {
    for (const entry of experience) {
      if (entry.projects) {
        for (const proj of entry.projects) {
          expect(proj.client.de).toBeTruthy();
          expect(proj.client.en).toBeTruthy();
          expect(proj.title.de).toBeTruthy();
          expect(proj.title.en).toBeTruthy();
          for (const bullet of proj.bullets) {
            expect(bullet.de).toBeTruthy();
            expect(bullet.en).toBeTruthy();
          }
        }
      }
    }
  });

  it("standalone bullets are bilingual", () => {
    for (const entry of experience) {
      if (entry.bullets) {
        for (const bullet of entry.bullets) {
          expect(bullet.de).toBeTruthy();
          expect(bullet.en).toBeTruthy();
        }
      }
    }
  });
});
