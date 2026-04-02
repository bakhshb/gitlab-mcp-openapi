import { describe, it, expect } from "vitest";
import { mapSpecPathToApiPath, buildUrl } from "../../src/utils/pathMapper.js";

describe("pathMapper", () => {
  describe("mapSpecPathToApiPath", () => {
    it("should return the path as-is (GitLab spec paths are already full paths)", () => {
      expect(mapSpecPathToApiPath("/api/v4/projects")).toBe("/api/v4/projects");
    });

    it("should handle paths with hyphens", () => {
      expect(mapSpecPathToApiPath("/api/v4/merge-requests")).toBe("/api/v4/merge-requests");
    });

    it("should return path unchanged when empty", () => {
      expect(mapSpecPathToApiPath("")).toBe("");
    });
  });

  describe("buildUrl", () => {
    it("should return the original URL when no path params provided", () => {
      expect(buildUrl("/api/v4/projects")).toBe("/api/v4/projects");
    });

    it("should return the original URL when path params is undefined", () => {
      expect(buildUrl("/api/v4/projects", undefined)).toBe("/api/v4/projects");
    });

    it("should substitute a single path parameter", () => {
      expect(buildUrl("/api/v4/projects/{id}", { id: 123 })).toBe("/api/v4/projects/123");
    });

    it("should substitute multiple path parameters", () => {
      expect(buildUrl("/api/v4/projects/{projectId}/issues/{issueId}", { projectId: "my-project", issueId: 42 })).toBe("/api/v4/projects/my-project/issues/42");
    });

    it("should URL-encode path parameter values", () => {
      expect(buildUrl("/api/v4/projects/{id}", { id: "my project/name" })).toBe("/api/v4/projects/my%20project%2Fname");
    });

    it("should handle numeric path parameters", () => {
      expect(buildUrl("/api/v4/users/{id}", { id: 0 })).toBe("/api/v4/users/0");
    });
  });
});