import decodeJWT from 'jwt-decode';
import moment from "moment/moment";
import {IJwtDecoder} from "./IJwtDecoder";

interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    [key: string]: any;
}

export class JwtDecoder implements IJwtDecoder {
    public getExpirationDate(jwtToken: string): Date {
        return moment(this.getExpiration(jwtToken)).toDate();
    }

    public isExpired(jwtToken: string): boolean {
        return this.getSecondsToExpire(jwtToken) <= 0;
    }

    private getSecondsToExpire(jwtToken: string): number {
        return Math.round(this.getExpiration(jwtToken) - Date.now());
    }

    private getExpiration(jwtToken: string): number {
        const jwtPayload = decodeJWT<JwtPayload>(jwtToken);
        if (!jwtPayload.exp) {
            throw new Error('Decoded JWT token is invalid, expiration is not defined');
        }

        return jwtPayload.exp * 1000;
    }
}

const jwtDecoder = new JwtDecoder();
export default jwtDecoder;
