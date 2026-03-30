/**
 * Response formatter for MCP tool outputs
 */
export declare class ResponseFormatter {
    static success(message: string, data: unknown): {
        content: {
            type: "text";
            text: string;
        }[];
    };
    static error(title: string, detail: string): {
        content: {
            type: "text";
            text: string;
        }[];
    };
}
//# sourceMappingURL=responseFormatter.d.ts.map