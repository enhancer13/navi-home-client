import Keychain from 'react-native-keychain';
import {IAuthenticationService} from './IAuthenticationService';
import {Authentication} from '../Authentication';
import {ITokenPair} from '../../../BackendTypes';
import ISecuredTokenStorage from '../SecuredStorage/ISecuredTokenStorage';
import IHttpClient from '../../../Framework/Net/HttpClient/IHttpClient';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {IJwtDecoder} from "../Helpers/IJwtDecoder";
import jwtDecoder from "../Helpers/JwtDecoder";
import {httpClient} from "../../../Framework/Net/HttpClient/HttpClient";
import {securedTokenStorage} from "../SecuredStorage/SecuredTokenStorage";
import {AuthConfiguration, authorize, refresh} from "react-native-app-auth";

const AUTHORIZATION_HEADER_KEY = 'Authorization';

export class AuthenticationService implements IAuthenticationService {
    private readonly _jwtDecoder: IJwtDecoder;
    private readonly _tokenStorage: ISecuredTokenStorage;
    private readonly _httpClient: IHttpClient;

    constructor(_jwtDecoder: IJwtDecoder, tokenStorage: ISecuredTokenStorage, httpClient: IHttpClient) {
        this._jwtDecoder = _jwtDecoder;
        this._tokenStorage = tokenStorage;
        this._httpClient = httpClient;
    }

    public async authenticateByCredentials(serverName: string, serverAddress: string): Promise<Authentication> {
        const authenticationConfig = this.getAuthenticationConfig(serverAddress);
        const authorizeResult = await authorize(authenticationConfig);

        //create authentication container
        const authentication = await this.createAuthentication(serverName, serverAddress, authorizeResult.accessToken);

        //save token pair in the secured token storage
        const tokenPair: ITokenPair = {
            accessToken: authorizeResult.accessToken,
            refreshToken: authorizeResult.refreshToken
        };

        await this._tokenStorage.saveTokenPair(serverName, authentication.user.name, tokenPair);
        return authentication;
    }

    public async authenticateByBiometric(username: string, serverName: string, serverAddress: string): Promise<Authentication> {
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

        const authenticationConfig = this.getAuthenticationConfig(serverAddress);
        const refreshResult = await refresh(authenticationConfig, {refreshToken: refreshToken});
        if (refreshResult.refreshToken === null) {
            throw new Error('Identity server configuration issue: Refreshing the access token yielded a null refresh token.');
        }

        //save token pair in the secured token storage
        await this._tokenStorage.saveTokenPair(serverName, username, {refreshToken: refreshResult.refreshToken, accessToken: refreshResult.accessToken});

        //create authentication container
        return this.createAuthentication(serverName, serverAddress, refreshResult.accessToken);
    }

    private createAuthorizationHeader(accessToken: string): { [key: string]: string } {
        return {
            [AUTHORIZATION_HEADER_KEY]: `Bearer ${accessToken}`
        };
    }

    private async createAuthentication(serverName: string, serverAddress: string, accessToken: string): Promise<Authentication> {
        const authentication = new Authentication(serverName, serverAddress, this.createAuthorizationHeader(accessToken), this._jwtDecoder.getExpirationDate(accessToken));
        authentication.user = await this._httpClient.get(backendEndpoints.Identity.USER_INFO, {authentication});
        return authentication;
    }

    private getAuthenticationConfig(serverAddress: string): AuthConfiguration {
        return {
            issuer: serverAddress + backendEndpoints.Identity.URL,
            clientId: 'MobileApp',
            redirectUrl: 'navihome:/oauthredirect',
            scopes: ['openid', 'email', 'profile', 'roles', 'offline_access'],
            additionalParameters: __DEV__ ? undefined : {'prompt': 'login' as const},
            dangerouslyAllowInsecureHttpRequests: __DEV__
        };
    }
}

const backendAuthService = new AuthenticationService(jwtDecoder, securedTokenStorage, httpClient);
export {backendAuthService};
