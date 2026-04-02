import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { createLogger } from "./logger.js";

const logger = createLogger("AxiosClient");

export type GitLabApiMode = "oauth" | "static";

export function getGitLabApiMode(): GitLabApiMode {
  if (process.env.OAUTH_ENABLED === "true") {
    return "oauth";
  }
  return "static";
}

export function getBaseUrl(): string {
  return process.env.GITLAB_API_URL ?? "https://gitlab.com";
}

export function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const mode = getGitLabApiMode();

  if (mode === "oauth") {
    // OAuth mode - token comes from MCP runtime context
    const accessToken = process.env.GITLAB_OAUTH_TOKEN;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  } else {
    // Static token mode
    const token = process.env.GITLAB_TOKEN ?? process.env.GITLAB_PERSONAL_ACCESS_TOKEN;
    if (token) {
      headers["PRIVATE-TOKEN"] = token;
    }
  }

  return headers;
}

export function getTimeout(): number {
  return parseInt(process.env.GITLAB_TIMEOUT ?? "30000", 10);
}

let clientInstance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (clientInstance) return clientInstance;

  const baseURL = getBaseUrl();
  const headers = getHeaders();
  const timeout = getTimeout();

  logger.info("Creating GitLab API client", { baseURL, mode: getGitLabApiMode() });

  clientInstance = axios.create({
    baseURL,
    timeout,
    headers,
  });

  clientInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      logger.debug("GitLab API request", {
        method: config.method?.toUpperCase(),
        url: config.url,
      });
      return config;
    },
    (error: AxiosError) => {
      logger.error("Request error", { error: error.message });
      return Promise.reject(error);
    }
  );

  clientInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.info("GitLab API response", {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      });
      return response;
    },
    (error: AxiosError) => {
      logger.error("API error", {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
      return Promise.reject(error);
    }
  );

  return clientInstance;
}

/**
 * Reset the client (for testing or when configuration changes)
 */
export function resetClient(): void {
  clientInstance = null;
}