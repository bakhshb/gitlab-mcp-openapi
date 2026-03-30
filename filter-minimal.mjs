/**
 * Filter GitLab OpenAPI spec to include ONLY the 29 tools' endpoints
 */

import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";

const FULL_SPEC_PATH = "/home/debian/.openclaw/workspace/work/gitlab-openapi.yaml";
const OUTPUT_PATH = "/home/debian/.openclaw/workspace/work/gitlab-mcp-openapi/reference/gitlab-minimal.yaml";

// Exact paths needed for the 29 tools
const NEEDED_PATTERNS = [
  // Projects - create, fork, list, get, search
  "/api/v4/projects",
  "/api/v4/projects/{id}",
  "/api/v4/projects/{id}/fork",
  
  // Repository - files
  "/api/v4/projects/{id}/repository/files/{file_path}/raw",
  "/api/v4/projects/{id}/repository/tree",
  
  // Repository - commits
  "/api/v4/projects/{id}/repository/commits",
  "/api/v4/projects/{id}/repository/commits/{sha}",
  "/api/v4/projects/{id}/repository/commits/{sha}/diff",
  
  // Merge Requests
  "/api/v4/projects/{id}/merge_requests",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approve",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/merge",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approvals",
  "/api/v4/projects/{id}/merge_requests/{merge_request_iid}/approval_state",
  
  // Pipelines
  "/api/v4/projects/{id}/pipeline",
  "/api/v4/projects/{id}/pipelines",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}/cancel",
  "/api/v4/projects/{id}/pipelines/{pipeline_id}/retry",
  "/api/v4/projects/{id}/pipelines/latest",
  
  // Jobs
  "/api/v4/projects/{id}/jobs",
  "/api/v4/projects/{id}/jobs/{job_id}",
  "/api/v4/projects/{id}/jobs/{job_id}/cancel",
  "/api/v4/projects/{id}/jobs/{job_id}/retry",
  
  // Issues
  "/api/v4/projects/{id}/issues",
  "/api/v4/projects/{id}/issues/{issue_iid}",
  "/api/v4/projects/{id}/issues/{issue_iid}/notes",
  "/api/v4/projects/{id}/issues/{issue_iid}/notes/{note_id}",
  "/api/v4/issues",
  
  // Releases
  "/api/v4/projects/{id}/releases",
  "/api/v4/projects/{id}/releases/{tag_name}",
  "/api/v4/projects/{id}/releases/{tag_name}/assets/links",
  "/api/v4/projects/{id}/releases/{tag_name}/assets/links/{link_id}",
  
  // Namespaces/Projects search
  "/api/v4/namespaces",
  "/api/v4/search",
  "/api/v4/users",
];

console.log("Loading GitLab OpenAPI spec...");
const fullSpec = yaml.load(readFileSync(FULL_SPEC_PATH, "utf-8"));

console.log("Filtering to minimal paths...");
const filteredPaths = {};

function matchesPattern(path, pattern) {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/{id}/g, "[^/]+")
    .replace(/{iid}/g, "[^/]+")
    .replace(/{sha}/g, "[^/]+")
    .replace(/{file_path}/g, ".+")
    .replace(/{pipeline_id}/g, "[^/]+")
    .replace(/{job_id}/g, "[^/]+")
    .replace(/{issue_id}/g, "[^/]+")
    .replace(/{note_id}/g, "[^/]+")
    .replace(/{tag_name}/g, "[^/]+")
    .replace(/{link_id}/g, "[^/]+");
  return new RegExp("^" + regexPattern + "$").test(path);
}

let includedCount = 0;

for (const [path, methods] of Object.entries(fullSpec.paths)) {
  const matchesPattern2 = NEEDED_PATTERNS.some(pattern => matchesPattern(path, pattern));
  
  if (matchesPattern2) {
    filteredPaths[path] = methods;
    includedCount++;
    console.log(`  ✓ ${path}`);
  }
}

// Build minimal spec - NO definitions (MCP returns raw JSON, no need for schemas)
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
  // No definitions - return raw JSON from GitLab API
};

console.log(`\nTotal paths included: ${includedCount}`);

console.log("Writing minimal spec...");
writeFileSync(OUTPUT_PATH, yaml.dump(filteredSpec, { lineWidth: 120 }));

console.log(`Done! Minimal spec written to ${OUTPUT_PATH}`);

// Check size
const fs = require("fs");
const stats = fs.statSync(OUTPUT_PATH);
console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);