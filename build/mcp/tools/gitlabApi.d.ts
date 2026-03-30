import { z } from "zod";
export declare const schema: {
    path: z.ZodString;
    method: z.ZodOptional<z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>>;
    pathParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
    queryParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    body: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
};
export declare const name = "gitlab-api";
export declare const description = "Execute any GitLab API operation. Specify the spec path (e.g. /api/v4/projects) and optional path params, query params, or body. HTTP method is auto-detected. Use gitlab-api-schema to discover available paths.";
export declare const annotations: {
    title: string;
    readOnlyHint: boolean;
    openWorldHint: boolean;
};
export declare function handler(input: {
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
    body?: Record<string, unknown>;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=gitlabApi.d.ts.map