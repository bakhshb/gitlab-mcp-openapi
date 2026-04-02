/**
 * Filter GitLab OpenAPI spec to include endpoints for all 44 tools
 * Target: ~100-150 paths covering full structured-world functionality
 */

import { readFileSync, writeFileSync, statSync } from "fs";
import * as yaml from "js-yaml";

const FULL_SPEC_PATH = "/home/debian/.openclaw/workspace/work/gitlab-openapi.yaml";
const OUTPUT_PATH = "/home/debian/.openclaw/workspace/work/gitlab-mcp-openapi/reference/gitlab-44tools.yaml";

// Paths needed for all 44 tools from structured-world
const NEEDED_PATTERNS = [
  // === Projects & Namespaces (4 tools) ===
  "/api/v4/projects",
  "/api/v4/projects/{id}",
  "/api/v4/projects/{id}/archive",
  "/api/v4/projects/{id}/unarchive",
  "/api/v4/projects/{id}/fork",
  "/api/v4/projects/{id}/transfer",
  "/api/v4/namespaces",
  "/api/v4/namespaces/{id}",
  "/api/v4/groups",
  "/api/v4/groups/{id}",
  
  // === Users & Events (3 tools) ===
  "/api/v4/users",
  "/api/v4/users/{id}",
  "/api/v4/events",
  "/api/v4/projects/{id}/events",
  
  // === Todos (2 tools) ===
  "/api/v4/todos",
  "/api/v4/todos/{id}",
  "/api/v4/todos/{id}/mark_as_done",
  "/api/v4/todos/{id}/mark_as_pending",
  "/api/v4/todos/mark_all_as_done",
  
  // === Labels (2 tools) ===
  "/api/v4/projects/{id}/labels",
  "/api/v4/groups/{id}/labels",
  "/api/v4/projects/{id}/labels/{name}",
  
  // === Merge Requests (5 tools) ===
  "/api/v4/projects/{id}/merge_requests",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approve",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approvals",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approval_state",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/merge",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/discussions",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/discussions/{discussion_id}",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/draft_notes",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/draft_notes/{note_id}",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/notes",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/notes/{note_id}",
  
  // === Repository - Commits & Files (4 tools) ===
  "/api/v4/projects/{id}/repository/commits",
  "/api/v4/projects/{id}/repository/commits/{sha}",
  "/api/v4/projects/{id}/repository/commits/{sha}/diff",
  "/api/v4/projects/{id}/repository/commits/{sha}/refs",
  "/api/v4/projects/{id}/repository/tree",
  "/api/v4/projects/{id}/repository/files/{file_path}",
  "/api/v4/projects/{id}/repository/files/{file_path}/raw",
  "/api/v4/projects/{id}/uploads",
  
  // === Repository - Branches & Tags (2 tools) ===
  "/api/v4/projects/{id}/repository/branches",
  "/api/v4/projects/{id}/repository/branches/{branch_name}",
  "/api/v4/projects/{id}/repository/branches/{branch_name}/protect",
  "/api/v4/projects/{id}/repository/branches/{branch_name}/unprotect",
  "/api/v4/projects/{id}/repository/tags",
  "/api/v4/projects/{id}/repository/tags/{tag_name}",
  
  // === Milestones (2 tools) ===
  "/api/v4/projects/{id}/milestones",
  "/api/v4/projects/{id}/milestones/{milestone_id}",
  
  // === Pipelines (3 tools) ===
  "/api/v4/projects/{id}/pipeline",
  "/api/v4/projects/{id}/pipelines",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}/cancel",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}/retry",
  "/api/v4/projects/{id}/pipelines/latest",
  "/api/v4/projects/{id}/jobs",
  "/api/v4/projects/{id}/jobs/{job_id}",
  "/api/v4/projects/{id}/jobs/{job_id}/cancel",
  "/api/v4/projects/{id}/jobs/{job_id}/retry",
  "/api/v4/projects/{id}/jobs/{job_id}/play",
  "/api/v4/projects/{id}/jobs/{job_id}/trace",
  
  // === Variables (2 tools) ===
  "/api/v4/projects/{id}/variables",
  "/api/v4/projects/{id}/variables/{key}",
  "/api/v4/groups/{id}/variables",
  "/api/v4/groups/{id}/variables/{key}",
  
  // === Wiki (2 tools) ===
  "/api/v4/projects/{id}/wikis",
  "/api/v4/projects/{id}/wikis/{slug}",
  
  // === Issues & Work Items (2 tools) ===
  "/api/v4/projects/{id}/issues",
  "/api/v4/projects/{id}/issues/{issue_iid}",
  "/api/v4/projects/{id}/issues/{issue_iid}/notes",
  "/api/v4/projects/{id}/issues/{issue_iid}/notes/{note_id}",
  "/api/v4/projects/{id}/issues/{issue_iid}/labels",
  "/api/v4/projects/{id}/issues/{issue_iid}/time_stats",
  "/api/v4/issues",
  "/api/v4/issues/{id}",
  
  // === Snippets (2 tools) ===
  "/api/v4/snippets",
  "/api/v4/snippets/{id}",
  "/api/v4/snippets/{id}/raw",
  
  // === Webhooks (2 tools) ===
  "/api/v4/projects/{id}/hooks",
  "/api/v4/projects/{id}/hooks/{hook_id}",
  "/api/v4/projects/{id}/hooks/{hook_id}/test",
  "/api/v4/groups/{id}/hooks",
  "/api/v4/groups/{id}/hooks/{hook_id}",
  
  // === Integrations (2 tools) ===
  "/api/v4/projects/{id}/integrations",
  "/api/v4/projects/{id}/integrations/{name}",
  
  // === Releases (2 tools) ===
  "/api/v4/projects/{id}/releases",
  "/api/v4/projects/{id}/releases/{tag_name}",
  "/api/v4/projects/{id}/releases/{tag_name}/assets/links",
  "/api/v4/projects/{id}/releases/{tag_name}/assets/links/{link_id}",
  
  // === Members (2 tools) ===
  "/api/v4/projects/{id}/members",
  "/api/v4/projects/{id}/members/{user_id}",
  "/api/v4/groups/{id}/members",
  "/api/v4/groups/{id}/members/{user_id}",
  
  // === Search & Iterations (2 tools) ===
  "/api/v4/search",
  "/api/v4/groups/{id}/iterations",
  "/api/v4/groups/{id}/iterations/{id}",
  
  // === Project snippets (related to snippets) ===
  "/api/v4/projects/{id}/snippets",
  "/api/v4/projects/{id}/snippets/{snippet_id}",
  "/api/v4/projects/{id}/snippets/{snippet_id}/raw",
  
  // === Project hooks (webhooks) ===
  "/api/v4/projects/{id}/hooks/{hook_id}",
  
  // === Protected branches ===
  "/api/v4/projects/{id}/protected_branches",
  "/api/v4/projects/{id}/protected_branches/{name}",
];

console.log("Loading GitLab OpenAPI spec...");
const fullSpec = yaml.load(readFileSync(FULL_SPEC_PATH, "utf-8"));

console.log("Filtering to 44-tool paths...");
const filteredPaths = {};

function matchesPattern(path, pattern) {
  const regexPattern = pattern
    .replace(/{id}/g, "[^/]+")
    .replace(/{iid}/g, "[^/]+")
    .replace(/{merge_request_iid}/g, "[^/]+")
    .replace(/{sha}/g, "[^/]+")
    .replace(/{file_path}/g, ".+")
    .replace(/{pipeline_id}/g, "[^/]+")
    .replace(/{job_id}/g, "[^/]+")
    .replace(/{issue_iid}/g, "[^/]+")
    .replace(/{note_id}/g, "[^/]+")
    .replace(/{tag_name}/g, "[^/]+")
    .replace(/{link_id}/g, "[^/]+")
    .replace(/{branch_name}/g, "[^/]+")
    .replace(/{key}/g, "[^/]+")
    .replace(/{slug}/g, "[^/]+")
    .replace(/{milestone_id}/g, "[^/]+")
    .replace(/{hook_id}/g, "[^/]+")
    .replace(/{name}/g, "[^/]+")
    .replace(/{user_id}/g, "[^/]+")
    .replace(/{snippet_id}/g, "[^/]+")
    .replace(/{discussion_id}/g, "[^/]+")
    .replace(/{ref}/g, "[^/]+");
  return new RegExp("^" + regexPattern + "$").test(path);
}

let includedCount = 0;
const matchedPatterns = new Set();

for (const [path, methods] of Object.entries(fullSpec.paths)) {
  const matchingPattern = NEEDED_PATTERNS.find(pattern => matchesPattern(path, pattern));
  
  if (matchingPattern) {
    filteredPaths[path] = methods;
    includedCount++;
    if (!matchedPatterns.has(matchingPattern)) {
      matchedPatterns.add(matchingPattern);
      console.log(`  ✓ ${matchingPattern}`);
    }
  }
}

// Build filtered spec - NO definitions (MCP returns raw JSON)
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

console.log(`\nTotal paths included: ${includedCount}`);

console.log("Writing 44-tool spec...");
writeFileSync(OUTPUT_PATH, yaml.dump(filteredSpec, { lineWidth: 120 }));

const stats = statSync(OUTPUT_PATH);
console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
console.log(`Done! Written to ${OUTPUT_PATH}`);
