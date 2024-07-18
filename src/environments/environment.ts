export interface Environment {
    apiURL: string;
    webUrl: string;
    isProduction: boolean;
}

export const environment: Environment = {
    // TODO: To be defined for production
    apiURL: 'http://localhost:3000',
    // TODO: To be defined for production
    webUrl: 'http://localhost:4200',
    isProduction: true,
};
