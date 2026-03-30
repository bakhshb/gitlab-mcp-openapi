import { AxiosInstance } from "axios";
export type GitLabApiMode = "oauth" | "static";
export declare function getGitLabApiMode(): GitLabApiMode;
export declare function getBaseUrl(): string;
export declare function getApiClient(): AxiosInstance;
/**
 * Reset the client (for testing or when configuration changes)
 */
export declare function resetClient(): void;
//# sourceMappingURL=apiClient.d.ts.map