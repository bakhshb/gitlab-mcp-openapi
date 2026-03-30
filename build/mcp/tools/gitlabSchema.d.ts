import { z } from "zod";
export declare const schema: {
    tag: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
};
export declare const name = "gitlab-api-schema";
export declare const description = "Discover available GitLab API operations from the OpenAPI spec. Call with no args for a tag overview, with tag to list operations in that tag, or with path for full parameter and request body details.";
export declare const annotations: {
    title: string;
    readOnlyHint: boolean;
    openWorldHint: boolean;
};
export declare function handler(input: {
    tag?: string;
    path?: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=gitlabSchema.d.ts.map