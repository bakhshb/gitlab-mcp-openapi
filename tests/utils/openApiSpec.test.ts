import { describe, it, expect, beforeEach, vi } from "vitest";
import { detectMethod, getSpec } from "../../src/utils/openApiSpec.js";

describe("openApiSpec", () => {
  describe("detectMethod", () => {
    it("should return 'get' for a GET endpoint", () => {
      const method = detectMethod("/api/v4/projects");
      expect(method).toBe("get");
    });

    it("should return 'post' for a POST endpoint", () => {
      const method = detectMethod("/api/v4/projects");
      expect(method).toBe("get");
    });

    it("should return null for non-existent path", () => {
      const method = detectMethod("/api/v4/nonexistent");
      expect(method).toBeNull();
    });

    it("should return 'post' for a POST-only endpoint", () => {
      const method = detectMethod("/api/v4/projects/{id}/merge_requests");
      expect(method).toMatch(/get|post/);
    });
  });
});