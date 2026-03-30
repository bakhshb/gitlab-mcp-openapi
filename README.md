# gitlab-mcp-openapi

2-tool OpenAPI-driven MCP server for GitLab.

## Overview

This MCP server provides a generic GitLab API executor using the OpenAPI pattern. Instead of 44+ individual tools, it exposes just 2 tools:

- **`gitlab-api`** - Execute any GitLab API operation
- **`gitlab-api-schema`** - Discover available API paths

## Installation

```bash
npm install -g @bakhshb/gitlab-mcp-openapi
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITLAB_TOKEN` | Yes | - | GitLab Personal Access Token |
| `GITLAB_API_URL` | No | `https://gitlab.com` | GitLab instance URL |
| `GITLAB_TIMEOUT` | No | `30000` | Request timeout (ms) |

### Creating a Token

1. Go to GitLab → Profile → Access Tokens
2. Create a token with `api` and `read_user` scopes
3. Set `GITLAB_TOKEN` environment variable

## Usage

### gitlab-api

```typescript
// List projects
{
  path: "/api/v4/projects",
  queryParams: { per_page: 10 }
}

// Get specific project
{
  path: "/api/v4/projects/{id}",
  pathParams: { id: 15 }
}

// Create a project (POST)
{
  path: "/api/v4/projects",
  method: "POST",
  body: {
    name: "my-new-project",
    namespace_id: 1,
    visibility: "private"
  }
}
```

### gitlab-api-schema

```typescript
// Get all API paths
{}

// Get paths in a segment
{ path: "/api/v4/projects" }

// Get methods for a specific path
{ path: "/api/v4/projects/{id}" }
```

## Example

```bash
# Run the server
gitlab-mcp-openapi
```

Or with custom configuration:

```bash
GITLAB_API_URL=https://gitlab.labby.space GITLAB_TOKEN=glpat-xxx gitlab-mcp-openapi
```

## Architecture

- **Spec-based**: Uses a filtered GitLab OpenAPI spec (744 paths)
- **Dynamic**: No hardcoded endpoints - uses the spec at runtime
- **Flexible**: Any GitLab REST API endpoint is accessible

## Development

```bash
# Build
npm run build

# Start
npm run start

# Test
node test-mcp.mjs
```