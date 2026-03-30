/**
 * Path mapper for GitLab API
 */
/**
 * GitLab API paths in the spec start with /api/v4/
 * We need to prepend the base URL to make them full URLs
 */
export declare function mapSpecPathToApiPath(specPath: string): string;
/**
 * Build the full URL with path parameters substituted
 */
export declare function buildUrl(apiPath: string, pathParams?: Record<string, string | number>): string;
//# sourceMappingURL=pathMapper.d.ts.map