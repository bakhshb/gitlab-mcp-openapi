/**
 * OpenAPI spec loader for GitLab API
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";
import { createLogger } from "./logger.js";

const logger = createLogger("OpenApiSpec");

// Resolve spec path relative to this file's location
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// From build/utils/ → ../../reference/gitlab-44tools.yaml
const SPEC_PATH = join(__dirname, "../../reference/gitlab-44tools.yaml");

export interface OpenApiSpec {
  swagger: string;
  info: Record<string, unknown>;
  host?: string;
  basePath?: string;
  schemes?: string[];
  produces?: string[];
  consumes?: string[];
  securityDefinitions: Record<string, unknown>;
  paths: Record<string, Record<string, OpenApiOperation>>;
}

export interface OpenApiOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  responses?: Record<string, unknown>;
  consumes?: string[];
  produces?: string[];
  security?: Record<string, unknown>[];
}

export interface OpenApiParameter {
  name: string;
  in: "path" | "query" | "header" | "body";
  description?: string;
  required?: boolean;
  type?: string;
  schema?: Record<string, unknown>;
}

let cachedSpec: OpenApiSpec | null = null;

/**
 * Loads and caches the OpenAPI spec from the local YAML file.
 */
export function getSpec(): OpenApiSpec {
  if (cachedSpec) return cachedSpec;

  logger.info("Loading OpenAPI spec from local file", { path: SPEC_PATH });
  const content = readFileSync(SPEC_PATH, "utf-8");
  cachedSpec = yaml.load(content) as OpenApiSpec;
  
  logger.info("OpenAPI spec loaded", {
    paths: Object.keys(cachedSpec.paths).length,
  });
  
  return cachedSpec;
}

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

const SUPPORTED_METHODS: HttpMethod[] = ["get", "post", "put", "delete", "patch"];

/**
 * Auto-detects the preferred HTTP method for a given path.
 */
export function detectMethod(path: string): HttpMethod | null {
  const spec = getSpec();
  const pathObj = spec.paths[path];
  if (!pathObj) return null;

  for (const method of SUPPORTED_METHODS) {
    if (method in pathObj) return method;
  }
  return null;
}