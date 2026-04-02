/**
 * Test script for gitlab-mcp-openapi
 * Run: node test-mcp.mjs
 */

import { spawn } from "child_process";
import { Readable } from "stream";

const MCP_SERVER = "./build/index.js";

async function runMcpTest() {
  console.log("Starting GitLab MCP server...");
  
  const server = spawn("node", [MCP_SERVER], {
    env: {
      ...process.env,
      GITLAB_API_URL: "https://gitlab.labby.space",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let responseBuffer = "";

  server.stdout.on("data", (data) => {
    responseBuffer += data.toString();
  });

  server.stderr.on("data", (data) => {
    console.log("Server:", data.toString());
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Send initialize request
  const initRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  });

  server.stdin?.write(initRequest + "\n");

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("Testing gitlab-api-schema...");
  
  // Send tool call for gitlab-api-schema
  const schemaRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "gitlab-api-schema",
      arguments: {}
    }
  });

  server.stdin?.write(schemaRequest + "\n");

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("Response:", responseBuffer.slice(-2000));

  server.kill();
  process.exit(0);
}

runMcpTest().catch(console.error);