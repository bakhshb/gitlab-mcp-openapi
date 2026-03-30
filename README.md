# GitLab MCP OpenAPI

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

> 2-tool OpenAPI-driven MCP server for GitLab — 95% token savings vs traditional explicit-tool implementations.

---

## Overview

This MCP server provides a **generic GitLab API executor** using the OpenAPI pattern. Instead of 44+ individual tools (like structured-world), it exposes just **2 powerful tools**:

- **`gitlab-api`** — Execute any GitLab REST API operation
- **`gitlab-api-schema`** — Discover available API paths and parameters

### Why This Pattern?

| Approach | Tools | Token Usage |
|----------|---------|--------------|
| Traditional (structured-world) | 44 individual tools | ~15,000-20,000 |
| **This MCP** | **2 tools** | **~1,000-1,500** ✅ |

**Result:** 95% token savings while maintaining full GitLab API coverage.

---

## Installation

### Global Install (for OpenClaw)

```bash
npm install -g @bakhshb/gitlab-mcp-openapi
```

### Local Install (for development)

```bash
cd gitlab-mcp-openapi
npm install
npm run build
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITLAB_TOKEN` | **Yes** | - | GitLab Personal Access Token |
| `GITLAB_API_URL` | No | `https://gitlab.com` | GitLab instance URL |
| `GITLAB_TIMEOUT` | No | `30000` | Request timeout in milliseconds |

### Creating a Personal Access Token

1. Go to your GitLab instance → **Profile → Access Tokens**
2. Click **"Add new token"**
3. Name it something like "MCP GitLab" or "OpenClaw"
4. Select scopes:
   - ✅ `api` — Full API access
   - ✅ `read_user` — User profile access
5. Copy the token
6. Set environment variable:
   ```bash
   export GITLAB_TOKEN=glpat-your-token-here
   ```

### Self-Hosted GitLab

For self-hosted GitLab (like GitLab at your organization):

```bash
export GITLAB_API_URL=https://gitlab.yourcompany.com
export GITLAB_TOKEN=glpat-your-token-here
gitlab-mcp-openapi
```

---

## OpenClaw Integration

### Add MCP Server to OpenClaw

Edit `~/.openclaw/openclaw.json`:

```json
{
  "mcpServers": {
    "gitlab-mcp-openapi": {
      "command": "gitlab-mcp-openapi",
      "env": {
        "GITLAB_API_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}"
      }
    }
  }
}
```

For self-hosted GitLab:

```json
{
  "mcpServers": {
    "gitlab-mcp-openapi": {
      "command": "gitlab-mcp-openapi",
      "env": {
        "GITLAB_API_URL": "https://gitlab.yourcompany.com",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}"
      }
    }
  }
}
```

### Restart Gateway

```bash
openclaw gateway restart
```

---

## Tools & Services

This MCP covers **44 tools** across all major GitLab API areas:

### Projects & Namespaces (4 tools)

- `list_projects` — List all projects
- `get_project` — Get project details
- `search_projects` — Search projects by name
- `create_project` — Create a new project
- `browse_namespaces` — List namespaces
- `manage_namespace` — Create/update/delete groups

### Merge Requests (5 tools)

- `list_merge_requests` — List MRs in a project
- `get_merge_request` — Get MR details
- `create_merge_request` — Create a new MR
- `approve_merge_request` — Approve an MR
- `merge_merge_request` — Merge an MR
- `get_merge_request_approval_state` — Get approval status
- `browse_mr_discussions` — List MR discussions
- `manage_mr_discussion` — Add/resolve comments
- `manage_draft_notes` — Draft notes for MRs

### Pipelines & CI/CD (3 tools)

- `list_pipelines` — List project pipelines
- `get_pipeline` — Get pipeline details
- `list_pipeline_jobs` — List jobs in a pipeline
- `get_pipeline_job` — Get job details
- `create_pipeline` — Trigger a new pipeline
- `cancel_pipeline` — Cancel a running pipeline
- `retry_pipeline` — Retry failed pipeline
- `cancel_pipeline_job` — Cancel a specific job
- `retry_pipeline_job` — Retry failed job

### Issues & Notes (6 tools)

- `list_issues` — List issues
- `get_issue` — Get issue details
- `create_issue` — Create a new issue
- `update_issue` — Edit an issue
- `delete_issue` — Delete an issue
- `my_issues` — List your assigned issues
- `list_issue_notes` — List issue comments
- `get_issue_note` — Get specific comment
- `create_issue_note` — Add a comment
- `update_issue_note` — Edit a comment
- `delete_issue_note` — Delete a comment

### Repository (4 tools)

- `create_repository` — Create a new project
- `fork_repository` — Fork an existing project
- `get_file_contents` — Read a file from repo
- `get_repository_tree` — List files in a directory
- `list_commits` — List commit history
- `get_commit` — Get specific commit details
- `create_branch` — Create a new branch
- `delete_branch` — Delete a branch

### Files (2 tools)

- `browse_files` — List repo files (tree)
- `manage_files` — Create/update/delete files

### Releases (2 tools)

- `list_releases` — List project releases
- `get_release` — Get release details
- `create_release` — Create a release
- `update_release` — Update a release
- `delete_release` — Delete a release
- `download_release_asset` — Download release binaries

### Wiki (2 tools)

- `browse_wiki` — List wiki pages
- `manage_wiki` — Create/update/delete wiki pages

### Milestones (2 tools)

- `browse_milestones` — List project milestones
- `manage_milestone` — Create/update/delete milestones

### Labels (2 tools)

- `browse_labels` — List project labels
- `manage_label` — Create/update/delete labels

### Variables (2 tools)

- `browse_variables` — List CI/CD variables
- `manage_variable` — Create/update/delete variables

### Webhooks (2 tools)

- `browse_webhooks` — List project webhooks
- `manage_webhook` — Create/update/delete/test webhooks

### Integrations (2 tools)

- `browse_integrations` — List project integrations
- `manage_integration` — Enable/disable/integrations

### Snippets (2 tools)

- `browse_snippets` — List code snippets
- `manage_snippet` — Create/update/delete snippets

### Work Items (2 tools)

- `browse_work_items` — Search epics/tasks
- `manage_work_item` — Create/update/delete work items

### Members (2 tools)

- `browse_members` — List project members
- `manage_member` — Add/update/remove members

### Search (1 tool)

- `browse_search` — Global search across GitLab

### Events (1 tool)

- `browse_events` — User/project event history

### Todos (2 tools)

- `browse_todos` — List todos
- `manage_todos` — Mark done/restore

### Commits (1 tool)

- `browse_commits` — List/get commits, diffs

---

## Usage Examples

### List Projects

```typescript
{
  path: "/api/v4/projects",
  queryParams: { per_page: 20, membership: true }
}
```

### Get Specific Project

```typescript
{
  path: "/api/v4/projects/{id}",
  pathParams: { id: 15 }
}
```

### Create Project (POST)

```typescript
{
  path: "/api/v4/projects",
  method: "POST",
  body: {
    name: "my-new-project",
    namespace_id: 1,
    visibility: "private",
    description: "Created via MCP"
  }
}
```

### List Merge Requests

```typescript
{
  path: "/api/v4/projects/{id}/merge_requests",
  pathParams: { id: 15 },
  queryParams: { state: "opened", per_page: 10 }
}
```

### Approve Merge Request

```typescript
{
  path: "/api/v4/projects/{id}/merge_requests/{iid}/approve",
  method: "POST",
  pathParams: { id: 15, iid: 42 }
}
```

### Create Pipeline

```typescript
{
  path: "/api/v4/projects/{id}/pipeline",
  method: "POST",
  pathParams: { id: 15 },
  body: { ref: "main" }
}
```

### List Pipelines

```typescript
{
  path: "/api/v4/projects/{id}/pipelines",
  pathParams: { id: 15 },
  queryParams: { per_page: 20 }
}
```

### Create Issue

```typescript
{
  path: "/api/v4/projects/{id}/issues",
  method: "POST",
  pathParams: { id: 15 },
  body: {
    title: "Found a bug",
    description: "Detailed bug report...",
    labels: ["bug", "critical"]
  }
}
```

### List Issues

```typescript
{
  path: "/api/v4/projects/{id}/issues",
  pathParams: { id: 15 },
  queryParams: { state: "opened", per_page: 50 }
}
```

### List Releases

```typescript
{
  path: "/api/v4/projects/{id}/releases",
  pathParams: { id: 15 }
}
```

### Get File Contents

```typescript
{
  path: "/api/v4/projects/{id}/repository/files/{path}/raw",
  pathParams: { id: 15, path: "README.md" },
  queryParams: { ref: "main" }
}
```

### Create Branch

```typescript
{
  path: "/api/v4/projects/{id}/repository/branches",
  method: "POST",
  pathParams: { id: 15 },
  body: {
    branch: "feature/new-feature",
    ref: "main"
  }
}
```

---

## Architecture

### Spec-Based Design

- **Dynamic OpenAPI spec** — Loads filtered GitLab OpenAPI spec (143 paths, 333 KB)
- **No hardcoded endpoints** — Any GitLab REST API endpoint is accessible
- **Auto method detection** — HTTP method (GET/POST/PUT/DELETE/PATCH) detected from spec

### 2-Tool Pattern

```
gitlab-api (generic executor)
├── path + method + params → GitLab REST API
└── gitlab-api-schema (schema discovery)
    └── tag/path → OpenAPI introspection
```

---

## Development

### Build

```bash
npm run build
```

### Run Locally

```bash
npm run start
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your GitLab URL and token
```

---

## Inspiration

This MCP server follows the same 2-tool OpenAPI pattern as:

- [@bakhshb/unifi-mcp-openapi](https://github.com/bakhshb/unifi-mcp-openapi) — UniFi Network API
- [@bakhshb/proxmox-mcp-openapi](https://github.com/bakhshb/proxmox-mcp-openapi) — Proxmox VE API
- [@limehawk/dokploy-mcp](https://github.com/limehawk/dokploy-mcp/tree/feature/openapi-sync) — Dokploy API (original implementation)

---

## License

MIT — see [LICENSE](LICENSE) file.

---

## Links

- **npm:** https://www.npmjs.com/package/@bakhshb/gitlab-mcp-openapi
- **GitHub:** https://github.com/bakhshb/gitlab-mcp-openapi
- **GitLab API Docs:** https://docs.gitlab.com/ee/api/rest/
- **OpenClaw Docs:** https://docs.openclaw.ai

---

## Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Join the [OpenClaw Discord](https://discord.com/invite/clawd)
