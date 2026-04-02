import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as gitlabApi from "./mcp/tools/api.js";
import * as gitlabSchema from "./mcp/tools/apiSchema.js";

export function createServer() {
  const server = new McpServer({
    name: "gitlab",
    version: "1.0.0",
  });

  server.tool(
    gitlabApi.name,
    gitlabApi.description,
    gitlabApi.schema,
    gitlabApi.annotations,
    gitlabApi.handler
  );

  server.tool(
    gitlabSchema.name,
    gitlabSchema.description,
    gitlabSchema.schema,
    gitlabSchema.annotations,
    gitlabSchema.handler
  );

  return server;
}