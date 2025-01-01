import {jwtDecode, JwtPayload} from 'jwt-decode';
import moment from 'moment/moment';
import {IJwtDecoder} from './IJwtDecoder';

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
        if (!jwtToken) {
            throw new Error('JWT token is undefined');
        }
        const decoded = jwtDecode<JwtPayload>(jwtToken);
        if (!decoded.exp) {
            throw new Error('Decoded JWT token is invalid, expiration is not defined');
        }
        return decoded.exp * 1000;
    }
}

const jwtDecoder = new JwtDecoder();
export default jwtDecoder;
