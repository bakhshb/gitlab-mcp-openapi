/**
 * Response formatter for MCP tool outputs
 */

export class ResponseFormatter {
  static success(message: string, data: unknown) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ message, data }, null, 2),
        },
      ],
    };
  }

  static error(title: string, detail: string) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ error: title, detail }, null, 2),
        },
      ],
    };
  }
}