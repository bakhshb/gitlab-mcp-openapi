import { z } from "zod";
import { getSpec } from "../../utils/openApiSpec.js";
import { getBaseUrl } from "../../utils/apiClient.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";
export const schema = {
    tag: z.string().optional().describe("Filter by tag (e.g. 'projects', 'merge_requests', 'groups')"),
    path: z.string().optional().describe("Get details for a specific path (e.g. /api/v4/projects)"),
};
export const name = "gitlab-api-schema";
export const description = "Discover available GitLab API operations from the OpenAPI spec. Call with no args for a tag overview, with tag to list operations in that tag, or with path for full parameter and request body details.";
export const annotations = {
    title: "GitLab API Schema",
    readOnlyHint: true,
    openWorldHint: true,
};
export async function handler(input) {
    const { tag, path } = input;
    const spec = getSpec();
    const baseUrl = getBaseUrl();
    if (path) {
        const specPathEntry = Object.entries(spec.paths).find(([p]) => p === path);
        if (!specPathEntry) {
            return ResponseFormatter.error("Path not found", `'${path}' not found. Available: ${Object.keys(spec.paths).slice(0, 10).join(", ")}...`);
        }
        const [specPath, operations] = specPathEntry;
        const methods = Object.keys(operations).filter((m) => m !== "parameters");
        return ResponseFormatter.success(`Path: ${specPath}`, {
            baseUrl,
            specPath,
            methods,
        });
    }
    if (tag) {
        const matchingPaths = Object.entries(spec.paths)
            .filter(([, ops]) => {
            const tagList = ops.tags ?? [];
            return tagList.includes(tag);
        })
            .map(([p]) => p);
        if (matchingPaths.length === 0) {
            const allTags = [...new Set(Object.values(spec.paths).flatMap((ops) => ops.tags ?? []))];
            return ResponseFormatter.error("Tag not found", `Tag '${tag}' not found. Available: ${allTags.join(", ")}`);
        }
        return ResponseFormatter.success(`Tag: ${tag} (${matchingPaths.length} paths)`, { tag, paths: matchingPaths });
    }
    // Return all tags summary
    const tagMap = new Map();
    for (const [p, ops] of Object.entries(spec.paths)) {
        const tags = ops.tags ?? ["untagged"];
        for (const t of tags) {
            if (!tagMap.has(t))
                tagMap.set(t, []);
            tagMap.get(t).push(p);
        }
    }
    // If no tags found, group by first path segment
    if (tagMap.size === 1 && tagMap.has("untagged")) {
        const segmentMap = new Map();
        for (const [p] of Object.entries(spec.paths)) {
            const segments = p.split("/").filter(Boolean);
            const segment = segments[0] || "root";
            if (!segmentMap.has(segment))
                segmentMap.set(segment, []);
            segmentMap.get(segment).push(p);
        }
        return ResponseFormatter.success(`GitLab API — ${Object.keys(spec.paths).length} paths across ${segmentMap.size} API segments`, {
            baseUrl,
            apiSegments: Object.fromEntries(segmentMap),
            totalPaths: Object.keys(spec.paths).length,
        });
    }
    return ResponseFormatter.success(`GitLab API — ${Object.keys(spec.paths).length} paths across ${tagMap.size} tags`, {
        baseUrl,
        tags: Object.fromEntries(tagMap),
        totalPaths: Object.keys(spec.paths).length,
    });
}
//# sourceMappingURL=gitlabSchema.js.map