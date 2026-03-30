/**
 * Logger utility for GitLab MCP server
 */
export declare function createLogger(module: string): {
    info: (message: string, meta?: Record<string, unknown>) => void;
    warn: (message: string, meta?: Record<string, unknown>) => void;
    error: (message: string, meta?: Record<string, unknown>) => void;
    debug: (message: string, meta?: Record<string, unknown>) => void;
};
//# sourceMappingURL=logger.d.ts.map