/**
 * Logger utility for GitLab MCP server
 */

const DEBUG = process.env.DEBUG === "true";

function formatMessage(level: string, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export function createLogger(module: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) => {
      console.log(formatMessage("INFO", `[${module}] ${message}`, meta));
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      console.warn(formatMessage("WARN", `[${module}] ${message}`, meta));
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      console.error(formatMessage("ERROR", `[${module}] ${message}`, meta));
    },
    debug: (message: string, meta?: Record<string, unknown>) => {
      if (DEBUG) {
        console.log(formatMessage("DEBUG", `[${module}] ${message}`, meta));
      }
    },
  };
}