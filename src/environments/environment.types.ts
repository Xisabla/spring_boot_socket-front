/**
 * Variable to store the environment configuration
 */
export interface Environment {
    /**
     * URL of the API
     */
    apiURL: string;
    /**
     * URL of the frontend (current application)
     */
    webUrl: string;
    /**
     * Production flag
     */
    isProduction: boolean;
}
