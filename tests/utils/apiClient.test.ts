import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getBaseUrl, getTimeout, getHeaders, getGitLabApiMode, resetClient } from "../../src/utils/apiClient.js";

describe("apiClient", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    resetClient();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetClient();
  });

  describe("getBaseUrl", () => {
    it("should return the GITLAB_API_URL from env", () => {
      process.env.GITLAB_API_URL = "https://gitlab.example.com";
      expect(getBaseUrl()).toBe("https://gitlab.example.com");
    });

    it("should return default GitLab URL when env not set", () => {
      delete process.env.GITLAB_API_URL;
      expect(getBaseUrl()).toBe("https://gitlab.com");
    });
  });

  describe("getTimeout", () => {
    it("should return the GITLAB_TIMEOUT from env as number", () => {
      process.env.GITLAB_TIMEOUT = "60000";
      expect(getTimeout()).toBe(60000);
    });

    it("should return default timeout when env not set", () => {
      delete process.env.GITLAB_TIMEOUT;
      expect(getTimeout()).toBe(30000);
    });

    it("should return NaN for invalid timeout value", () => {
      process.env.GITLAB_TIMEOUT = "invalid";
      expect(getTimeout()).toBeNaN();
    });
  });

  describe("getGitLabApiMode", () => {
    it("should return 'oauth' when OAUTH_ENABLED is 'true'", () => {
      process.env.OAUTH_ENABLED = "true";
      expect(getGitLabApiMode()).toBe("oauth");
    });

    it("should return 'static' when OAUTH_ENABLED is not set", () => {
      delete process.env.OAUTH_ENABLED;
      expect(getGitLabApiMode()).toBe("static");
    });

    it("should return 'static' when OAUTH_ENABLED is 'false'", () => {
      process.env.OAUTH_ENABLED = "false";
      expect(getGitLabApiMode()).toBe("static");
    });
  });

  describe("getHeaders", () => {
    it("should return default headers with Content-Type and Accept", () => {
      delete process.env.OAUTH_ENABLED;
      delete process.env.GITLAB_TOKEN;
      delete process.env.GITLAB_PERSONAL_ACCESS_TOKEN;

      const headers = getHeaders();
      expect(headers).toHaveProperty("Content-Type", "application/json");
      expect(headers).toHaveProperty("Accept", "application/json");
    });

    it("should include PRIVATE-TOKEN header in static mode", () => {
      delete process.env.OAUTH_ENABLED;
      process.env.GITLAB_TOKEN = "test-token-123";

      const headers = getHeaders();
      expect(headers).toHaveProperty("PRIVATE-TOKEN", "test-token-123");
    });

    it("should include Authorization header in oauth mode", () => {
      process.env.OAUTH_ENABLED = "true";
      process.env.GITLAB_OAUTH_TOKEN = "oauth-token-456";

      const headers = getHeaders();
      expect(headers).toHaveProperty("Authorization", "Bearer oauth-token-456");
    });

    it("should prefer GITLAB_TOKEN over GITLAB_PERSONAL_ACCESS_TOKEN", () => {
      delete process.env.OAUTH_ENABLED;
      process.env.GITLAB_TOKEN = "token-v1";
      process.env.GITLAB_PERSONAL_ACCESS_TOKEN = "token-v2";

      const headers = getHeaders();
      expect(headers).toHaveProperty("PRIVATE-TOKEN", "token-v1");
    });
  });
});