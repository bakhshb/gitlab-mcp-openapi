import axios from "axios";
import { createLogger } from "./logger.js";
const logger = createLogger("AxiosClient");
export function getGitLabApiMode() {
    if (process.env.OAUTH_ENABLED === "true") {
        return "oauth";
    }
    return "static";
}
export function getBaseUrl() {
    return process.env.GITLAB_API_URL ?? "https://gitlab.com";
}
export function getHeaders() {
    const headers = {
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
    }
    else {
        // Static token mode
        const token = process.env.GITLAB_TOKEN ?? process.env.GITLAB_PERSONAL_ACCESS_TOKEN;
        if (token) {
            headers["PRIVATE-TOKEN"] = token;
        }
    }
    return headers;
}
export function getTimeout() {
    return parseInt(process.env.GITLAB_TIMEOUT ?? "30000", 10);
}
let clientInstance = null;
export function getApiClient() {
    if (clientInstance)
        return clientInstance;
    const baseURL = getBaseUrl();
    const headers = getHeaders();
    const timeout = getTimeout();
    logger.info("Creating GitLab API client", { baseURL, mode: getGitLabApiMode() });
    clientInstance = axios.create({
        baseURL,
        timeout,
        headers,
    });
    clientInstance.interceptors.request.use((config) => {
        logger.debug("GitLab API request", {
            method: config.method?.toUpperCase(),
            url: config.url,
        });
        return config;
    }, (error) => {
        logger.error("Request error", { error: error.message });
        return Promise.reject(error);
    });
    clientInstance.interceptors.response.use((response) => {
        logger.info("GitLab API response", {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
        });
        return response;
    }, (error) => {
        logger.error("API error", {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
        });
        return Promise.reject(error);
    });
    return clientInstance;
}
/**
 * Reset the client (for testing or when configuration changes)
 */
export function resetClient() {
    clientInstance = null;
}
//# sourceMappingURL=apiClient.js.map