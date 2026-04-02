import { z } from "zod";
import { AxiosError } from "axios";
import { getApiClient } from "../../utils/apiClient.js";
import { mapSpecPathToApiPath, buildUrl } from "../../utils/pathMapper.js";
import { createLogger } from "../../utils/logger.js";
import { getSpec, detectMethod, type HttpMethod } from "../../utils/openApiSpec.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

const logger = createLogger("GitLabApi");

export const schema = {
  path: z.string().min(1).describe("OpenAPI spec path (e.g. /api/v4/projects)"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).optional().describe("HTTP method. Auto-detected if omitted."),
  pathParams: z.record(z.union([z.string(), z.number()])).optional().describe("Path parameters to substitute (e.g. { id: '123' })"),
  queryParams: z.record(z.unknown()).optional().describe("Query string parameters"),
  body: z.record(z.unknown()).optional().describe("JSON request body"),
};

export const name = "gitlab-api";

export const description =
  "Execute any GitLab API operation. Specify the spec path (e.g. /api/v4/projects) and optional path params, query params, or body. HTTP method is auto-detected. Use gitlab-api-schema to discover available paths.";

export const annotations = {
  title: "GitLab API",
  readOnlyHint: false,
  openWorldHint: true,
};

export async function handler(input: {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, unknown>;
  body?: Record<string, unknown>;
}) {
  const { path, pathParams, queryParams, body } = input;

  try {
    const spec = getSpec();
    const specPathEntry = Object.entries(spec.paths).find(([p]) => p === path);
    if (!specPathEntry) {
      return ResponseFormatter.error(
        "Path not found",
        `'${path}' not found in OpenAPI spec. Use gitlab-api-schema to discover available paths.`
      );
    }

    const [specPath] = specPathEntry;
    const methodRaw: HttpMethod = input.method
      ? (input.method.toLowerCase() as HttpMethod)
      : (detectMethod(specPath) ?? "get");

    const apiPath = mapSpecPathToApiPath(specPath);
    const url = buildUrl(apiPath, pathParams);

    logger.info(`Calling ${methodRaw.toUpperCase()} ${url}`);

    const client = getApiClient();
    let responseData: unknown;

    if (methodRaw === "get" || methodRaw === "delete") {
      const response = await client[methodRaw](url, { params: queryParams });
      responseData = response.data;
    } else {
      const response = await client[methodRaw](url, body ?? {});
      responseData = response.data;
    }

    return ResponseFormatter.success(
      `${methodRaw.toUpperCase()} ${url} succeeded`,
      responseData
    );
  } catch (error) {
    logger.error(`${input.method ?? "GET"} ${path} failed`, {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown> | undefined;
      const detail = (data as any)?.error ?? (data as any)?.message ?? error.message;

      if (status === 401) {
        return ResponseFormatter.error("Authentication failed", "Check GITLAB_TOKEN or OAuth configuration");
      }
      if (status === 403) {
        return ResponseFormatter.error("Access denied", `Insufficient permissions for ${path}`);
      }
      if (status === 404) {
        return ResponseFormatter.error("Not found", `Path ${path} not found`);
      }
      if (status === 429) {
        return ResponseFormatter.error("Rate limited", "Too many requests, slow down");
      }
      return ResponseFormatter.error(`HTTP ${status}`, detail);
    }

    return ResponseFormatter.error(
      "Request failed",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}