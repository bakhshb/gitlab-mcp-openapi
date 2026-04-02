import { describe, it, expect } from "vitest";
import { ResponseFormatter } from "../../src/utils/responseFormatter.js";

describe("responseFormatter", () => {
  describe("success", () => {
    it("should return a properly formatted success response with data", () => {
      const result = ResponseFormatter.success("Operation successful", { id: 123, name: "test" });

      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty("type", "text");
      
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toHaveProperty("message", "Operation successful");
      expect(parsed).toHaveProperty("data");
      expect(parsed.data).toEqual({ id: 123, name: "test" });
    });

    it("should handle null data", () => {
      const result = ResponseFormatter.success("Done", null);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data).toBeNull();
    });

    it("should handle empty object data", () => {
      const result = ResponseFormatter.success("Done", {});
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data).toEqual({});
    });
  });

  describe("error", () => {
    it("should return a properly formatted error response", () => {
      const result = ResponseFormatter.error("Not Found", "Resource does not exist");

      expect(result).toHaveProperty("content");
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty("type", "text");
      
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toHaveProperty("error", "Not Found");
      expect(parsed).toHaveProperty("detail", "Resource does not exist");
    });

    it("should handle empty detail string", () => {
      const result = ResponseFormatter.error("Error", "");
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.detail).toBe("");
    });
  });
});