/**
 * Logger utility for GitLab MCP server
 */
const DEBUG = process.env.DEBUG === "true";
function formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
}
export function createLogger(module) {
    return {
        info: (message, meta) => {
            console.log(formatMessage("INFO", `[${module}] ${message}`, meta));
        },
        warn: (message, meta) => {
            console.warn(formatMessage("WARN", `[${module}] ${message}`, meta));
        },
        error: (message, meta) => {
            console.error(formatMessage("ERROR", `[${module}] ${message}`, meta));
        },
        debug: (message, meta) => {
            if (DEBUG) {
                console.log(formatMessage("DEBUG", `[${module}] ${message}`, meta));
            }
        },
    };
}
//# sourceMappingURL=logger.js.map