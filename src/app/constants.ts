export class AppConstants {
    public static BASE_URL = 'http://localhost:8091/api/';

    public static buildUrl(endpoint: string): string {
        return `${this.BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    }
}
