/**
 * Path mapper for GitLab API
 */
import { createLogger } from "./logger.js";
const logger = createLogger("PathMapper");
/**
 * GitLab API paths in the spec start with /api/v4/
 * We need to prepend the base URL to make them full URLs
 */
export function mapSpecPathToApiPath(specPath) {
    // GitLab spec paths are already full paths (e.g., /api/v4/projects)
    // No transformation needed
    return specPath;
}
/**
 * Build the full URL with path parameters substituted
 */
export function buildUrl(apiPath, pathParams) {
    if (!pathParams)
        return apiPath;
    let url = apiPath;
    for (const [key, value] of Object.entries(pathParams)) {
        url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
    return url;
}
//# sourceMappingURL=pathMapper.js.map