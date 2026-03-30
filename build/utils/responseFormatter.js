/**
 * Response formatter for MCP tool outputs
 */
export class ResponseFormatter {
    static success(message, data) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ message, data }, null, 2),
                },
            ],
        };
    }
    static error(title, detail) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ error: title, detail }, null, 2),
                },
            ],
        };
    }
}
//# sourceMappingURL=responseFormatter.js.map