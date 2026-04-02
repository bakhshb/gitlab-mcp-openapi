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
let cachedSpec = null;
/**
 * Loads and caches the OpenAPI spec from the local YAML file.
 */
export function getSpec() {
    if (cachedSpec)
        return cachedSpec;
    logger.info("Loading OpenAPI spec from local file", { path: SPEC_PATH });
    const content = readFileSync(SPEC_PATH, "utf-8");
    cachedSpec = yaml.load(content);
    logger.info("OpenAPI spec loaded", {
        paths: Object.keys(cachedSpec.paths).length,
    });
    return cachedSpec;
}
const SUPPORTED_METHODS = ["get", "post", "put", "delete", "patch"];
/**
 * Auto-detects the preferred HTTP method for a given path.
 */
export function detectMethod(path) {
    const spec = getSpec();
    const pathObj = spec.paths[path];
    if (!pathObj)
        return null;
    for (const method of SUPPORTED_METHODS) {
        if (method in pathObj)
            return method;
    }
    return null;
}
//# sourceMappingURL=openApiSpec.js.map