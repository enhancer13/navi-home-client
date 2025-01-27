import Keychain from 'react-native-keychain';
import {IBackendAuthService} from './IBackendAuthService';
import {Authentication} from '../Authentication';
import {ITokenPair} from '../../../BackendTypes';
import ISecuredTokenStorage from '../SecuredStorage/ISecuredTokenStorage';
import IHttpClient from '../../../Framework/Net/HttpClient/IHttpClient';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {IJwtDecoder} from '../Helpers/IJwtDecoder';
import jwtDecoder from '../Helpers/JwtDecoder';
import {httpClient} from '../../../Framework/Net/HttpClient/HttpClient';
import {securedTokenStorage} from '../SecuredStorage/SecuredTokenStorage';

const AUTHORIZATION_HEADER_KEY = 'Authorization';

export class BackendAuthService implements IBackendAuthService {
    private readonly _jwtDecoder: IJwtDecoder;
    private readonly _tokenStorage: ISecuredTokenStorage;
    private readonly _httpClient: IHttpClient;

    constructor(_jwtDecoder: IJwtDecoder, tokenStorage: ISecuredTokenStorage, httpClient: IHttpClient) {
        this._jwtDecoder = _jwtDecoder;
        this._tokenStorage = tokenStorage;
        this._httpClient = httpClient;
    }

    public async authenticateByCredentials(username: string, password: string, serverName: string, serverAddress: string): Promise<Authentication> {
        //retrieve token pair
        const payload = JSON.stringify({username, password});
        const url = serverAddress + backendEndpoints.Authentication.JWT_LOGIN;
        const tokenPair: ITokenPair = await this._httpClient.put(url, {body: payload});

        //save token pair in the secured token storage
        await this._tokenStorage.saveTokenPair(serverName, username, tokenPair);

        //create authentication container
        return this.createAuthentication(serverName, serverAddress, tokenPair.accessToken);
    }

    public async authenticateByBiometric(username: string, serverName: string, serverAddress: string,): Promise<Authentication> {
        // check biometry authentication support
        const biometricSupport = (await Keychain.getSupportedBiometryType()) !== null;
        if (!biometricSupport) {
            throw new Error('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        }

        const accessToken = await this._tokenStorage.getAccessToken(serverName, username);
        // return authentication if access token is not expired yet
        if (!this._jwtDecoder.isExpired(accessToken)) {
            return this.createAuthentication(serverName, serverAddress, accessToken);
        }

        // if access token is expired try to use refresh to token to retrieve new token pair
        const refreshToken = await this._tokenStorage.getRefreshToken(serverName, username);
        if (this._jwtDecoder.isExpired(refreshToken)) {
            await this._tokenStorage.removeTokenPair(serverName, username);
            throw new Error('Session has expired, please authenticate with your credentials.');
        }

        const payload = JSON.stringify({accessToken, refreshToken});
        const url = serverAddress + backendEndpoints.Authentication.JWT_TOKEN_REFRESH;
        const newTokenPair: ITokenPair = await this._httpClient.put(url, {body: payload});

        //save token pair in the secured token storage
        await this._tokenStorage.saveTokenPair(serverName, username, newTokenPair);

        //create authentication container
        return this.createAuthentication(serverName, serverAddress, newTokenPair.accessToken);
    }

    private createAuthorizationHeader(accessToken: string): { [key: string]: string } {
        return {
            [AUTHORIZATION_HEADER_KEY]: `Bearer ${accessToken}`,
        };
    }

    private async createAuthentication(serverName: string, serverAddress: string, accessToken: string): Promise<Authentication> {
        const authentication = new Authentication(serverName, serverAddress, this.createAuthorizationHeader(accessToken), this._jwtDecoder.getExpirationDate(accessToken));
        authentication.user = await this._httpClient.get(backendEndpoints.Authentication.AUTH_USERINFO, {authentication});
        return authentication;
    }
}

const backendAuthService = new BackendAuthService(jwtDecoder, securedTokenStorage, httpClient);
export {backendAuthService};
