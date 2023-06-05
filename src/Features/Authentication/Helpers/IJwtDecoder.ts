export interface IJwtDecoder {
    getExpirationDate(jwtToken: string): Date;

    isExpired(jwtToken: string): boolean;
}
