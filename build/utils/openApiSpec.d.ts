/**
 * OpenAPI spec loader for GitLab API
 */
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
/**
 * Loads and caches the OpenAPI spec from the local YAML file.
 */
export declare function getSpec(): OpenApiSpec;
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";
/**
 * Auto-detects the preferred HTTP method for a given path.
 */
export declare function detectMethod(path: string): HttpMethod | null;
//# sourceMappingURL=openApiSpec.d.ts.map