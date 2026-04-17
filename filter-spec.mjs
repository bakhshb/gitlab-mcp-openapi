/**
 * Filter GitLab OpenAPI spec to include only the paths needed for the 44 tools
 */

import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";

const FULL_SPEC_PATH = "/home/debian/.openclaw/workspace/work/gitlab-openapi.yaml";
const OUTPUT_PATH = "/home/debian/.openclaw/workspace/work/gitlab-mcp-openapi/reference/gitlab-filtered.yaml";

// Paths we need (prefixes - we'll include any path starting with these)
const NEEDED_PATH_PREFIXES = [
  "/api/v4/projects",
  "/api/v4/groups",
  "/api/v4/users",
  "/api/v4/namespaces",
  "/api/v4/events",
  "/api/v4/todos",
  "/api/v4/merge_requests",
  "/api/v4/issues",
  "/api/v4/snippets",
  "/api/v4/keys",
  "/api/v4/search",
  "/api/v4/runners",
  "/api/v4/settings",
  "/api/v4/user",
  "/api/v4/util",
  "/api/v4/version",
];

// More specific paths (exact or pattern-based)
const NEEDED_PATTERNS = [
  "/api/v4/projects/{id}/archive",
  "/api/v4/projects/{id}/unarchive",
  "/api/v4/projects/{id}/fork",
  "/api/v4/projects/{id}/transfer",
  "/api/v4/projects/{id}/labels",
  "/api/v4/projects/{id}/labels/{name}",
  "/api/v4/groups/{id}/labels",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approve",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/merge",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/discussions",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/discussions/{discussion_id}",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/draft_notes",
  "/api/v4/projects/{id}/repository/commits",
  "/api/v4/projects/{id}/repository/commits/{sha}",
  "/api/v4/projects/{id}/repository/commits/{sha}/diff",
  "/api/v4/projects/{id}/repository/tree",
  "/api/v4/projects/{id}/repository/files",
  "/api/v4/projects/{id}/repository/files/{path}",
  "/api/v4/projects/{id}/repository/branches",
  "/api/v4/projects/{id}/repository/branches/{name}",
  "/api/v4/projects/{id}/repository/tags",
  "/api/v4/projects/{id}/uploads",
  "/api/v4/projects/{id}/pipelines",
  "/api/v4/projects/{id}/pipelines/{id}",
  "/api/v4/projects/{id}/jobs",
  "/api/v4/projects/{id}/jobs/{id}",
  "/api/v4/projects/{id}/variables",
  "/api/v4/projects/{id}/variables/{key}",
  "/api/v4/groups/{id}/variables",
  "/api/v4/groups/{id}/variables/{key}",
  "/api/v4/projects/{id}/milestones",
  "/api/v4/projects/{id}/milestones/{id}",
  "/api/v4/projects/{id}/wikis",
  "/api/v4/projects/{id}/wikis/{slug}",
  "/api/v4/projects/{id}/hooks",
  "/api/v4/projects/{id}/hooks/{hook_id}",
  "/api/v4/projects/{id}/hooks/{hook_id}/test",
  "/api/v4/projects/{id}/integrations",
  "/api/v4/projects/{id}/integrations/{name}",
  "/api/v4/projects/{id}/releases",
  "/api/v4/projects/{id}/releases/{tag_name}",
  "/api/v4/projects/{id}/members",
  "/api/v4/projects/{id}/members/{user_id}",
  "/api/v4/groups/{id}/members",
  "/api/v4/groups/{id}/members/{user_id}",
  "/api/v4/groups/{id}/iterations",
];

console.log("Loading GitLab OpenAPI spec...");
const fullSpec = yaml.load(readFileSync(FULL_SPEC_PATH, "utf-8"));

console.log("Filtering paths...");
const filteredPaths = {};

let includedCount = 0;
let matchedByPrefix = 0;

for (const [path, methods] of Object.entries(fullSpec.paths)) {
  // Check if path matches any prefix
  const matchesPrefix = NEEDED_PATH_PREFIXES.some(prefix => path.startsWith(prefix));
  
  // Check if path matches any pattern
  const matchesPattern = NEEDED_PATTERNS.some(pattern => {
    // Convert pattern to regex (simplified)
    const regexPattern = pattern
      .replace(/{id}/g, "[^/]+")
      .replace(/{merge_request_iid}/g, "[^/]+")
      .replace(/{sha}/g, "[^/]+")
      .replace(/{name}/g, "[^/]+")
      .replace(/{path}/g, ".+")
      .replace(/{slug}/g, ".+")
      .replace(/{key}/g, "[^/]+")
      .replace(/{hook_id}/g, "[^/]+")
      .replace(/{tag_name}/g, "[^/]+")
      .replace(/{user_id}/g, "[^/]+")
      .replace(/{discussion_id}/g, "[^/]+")
      .replace(/{note_id}/g, "[^/]+");
    return new RegExp("^" + regexPattern + "$").test(path);
  });
  
  if (matchesPrefix || matchesPattern) {
    filteredPaths[path] = methods;
    includedCount++;
    if (matchesPrefix && !matchesPattern) {
      matchedByPrefix++;
    }
  }
}

console.log(`Included ${includedCount} paths (${matchedByPrefix} by prefix)`);

// Build filtered spec
const filteredSpec = {
  swagger: fullSpec.swagger,
  info: fullSpec.info,
  host: fullSpec.host,
  basePath: fullSpec.basePath,
  schemes: fullSpec.schemes,
  produces: fullSpec.produces,
  consumes: fullSpec.consumes,
  securityDefinitions: fullSpec.securityDefinitions,
  paths: filteredPaths,
};

console.log("Writing filtered spec...");
writeFileSync(OUTPUT_PATH, yaml.dump(filteredSpec, { lineWidth: 120 }));

console.log(`Done! Filtered spec written to ${OUTPUT_PATH}`);
console.log(`Total paths: ${Object.keys(filteredPaths).length}`);