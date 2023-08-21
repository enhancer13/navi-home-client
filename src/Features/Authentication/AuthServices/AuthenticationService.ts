import {Authentication} from '../Authentication';
import ISecuredTokenStorage from '../SecuredStorage/ISecuredTokenStorage';
import IHttpClient from '../../../Framework/Net/HttpClient/IHttpClient';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {IJwtDecoder} from "../Helpers/IJwtDecoder";
import jwtDecoder from "../Helpers/JwtDecoder";
import {httpClient} from "../../../Framework/Net/HttpClient/HttpClient";
import {securedTokenStorage} from "../SecuredStorage/SecuredTokenStorage";
import {AuthConfiguration, authorize, refresh} from "react-native-app-auth";
import {AuthenticationInfo, authenticationInfoStorage, IAuthenticationInfoStorage, ServerInfo} from "../../DataStorage";
import Keychain, {BIOMETRY_TYPE} from "react-native-keychain";

const AUTHORIZATION_HEADER_KEY = 'Authorization';

export type BiometricAuthCheckResult = {
    isAvailable: boolean;
    biometryType: null | BIOMETRY_TYPE;
    reason?: string;
};

/**
 * The `AuthenticationService` is responsible for handling user authentication.
 * This includes both biometric and credentials-based authentication.
 */
export class AuthenticationService {
    private readonly _jwtDecoder: IJwtDecoder;
    private readonly _tokenStorage: ISecuredTokenStorage;
    private readonly _authenticationInfoStorage: IAuthenticationInfoStorage;
    private readonly _httpClient: IHttpClient;

    constructor(_jwtDecoder: IJwtDecoder, tokenStorage: ISecuredTokenStorage, authenticationInfoStorage: IAuthenticationInfoStorage, httpClient: IHttpClient) {
        this._jwtDecoder = _jwtDecoder;
        this._tokenStorage = tokenStorage;
        this._authenticationInfoStorage = authenticationInfoStorage;
        this._httpClient = httpClient;
    }

    /**
     * Initiates credentials-based authentication.
     *
     * @param serverInfo - Information about the authentication server.
     * @returns Promise resolving to the authentication result.
     */
    public async initiateCredentialsAuthentication(serverInfo: ServerInfo): Promise<Authentication> {
        const {serverName, serverAddress} = serverInfo;
        const authenticationConfig = this.getAuthenticationConfig(serverAddress);
        const authorizeResult = await authorize(authenticationConfig);

        // process authorize result and create authentication container
        return await this.processAuthentication(serverName, serverAddress, authorizeResult.accessToken, authorizeResult.refreshToken);
    }

    /**
     * Initiates biometric-based authentication.
     *
     * This method relies on a previously saved refresh token obtained from the first
     * credentials-based authentication. If the refresh token has expired or is invalid,
     * it will trigger the standard credentials-based authentication.
     *
     * @param username - Username of the user to authenticate.
     * @param serverInfo - Information about the authentication server.
     * @returns Promise resolving to the authentication result.
     * @throws Will throw an error if the server configuration results in a null refresh token.
     */
    public async initiateBiometricAuthentication(username: string, serverInfo: ServerInfo): Promise<Authentication> {
        // check biometry authentication support
        if (!await this.getBiometricSupport()) {
            throw new Error('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        }

        // check if refresh token is available
        const {serverName, serverAddress} = serverInfo;
        const refreshToken = await this._tokenStorage.getRefreshToken(serverName, username);
        const authenticationConfig = this.getAuthenticationConfig(serverAddress);

        let refreshResult;
        try {
            refreshResult = await refresh(authenticationConfig, {refreshToken: refreshToken});
        } catch (error: any) {
            // initiate credentials authentication
            return await this.initiateCredentialsAuthentication(serverInfo);
        }

        if (refreshResult.refreshToken === null) {
            throw new Error('Identity server configuration issue: Refreshing the access token yielded a null refresh token.');
        }

        // process refresh result and create authentication container
        return this.processAuthentication(serverName, serverAddress, refreshResult.accessToken, refreshResult.refreshToken);
    }

    /**
     * Checks the availability of biometric authentication for the given user and server.
     *
     * The method determines the availability based on two primary conditions:
     * 1. Presence of a refresh token which indicates the user previously completed
     *    a credentials-based authentication.
     * 2. Device support for biometric authentication (e.g., fingerprint, face ID).
     *
     * @param serverInfo - Information about the authentication server.
     * @param username - Username of the user for whom the check is being made.
     *
     * @returns Promise resolving to an object containing:
     *   - isAvailable: A boolean indicating if biometric authentication is possible.
     *   - reason (optional): A string providing the reason when biometric authentication isn't available.
     */
    public async checkBiometricAuthenticationAvailability(serverInfo: ServerInfo | null, username: string | undefined): Promise<BiometricAuthCheckResult> {
        const biometryType = await Keychain.getSupportedBiometryType();

        if (biometryType === null) {
            return { isAvailable: false, reason: 'Biometrics not supported.', biometryType };
        }

        if (!serverInfo || !username) {
            return { isAvailable: false, biometryType, reason: 'Please authenticate with credentials first.' };
        }

        const hasToken = await this._tokenStorage.hasRefreshToken(serverInfo.serverName, username);
        if (!hasToken) {
            return { isAvailable: false, reason: 'Please authenticate with credentials first.', biometryType };
        }

        return { isAvailable: true, biometryType };
    }

    private async processAuthentication(serverName: string, serverAddress: string, accessToken: string, refreshToken: string): Promise<Authentication> {
        const authentication = new Authentication(serverName, serverAddress, this.createAuthorizationHeader(accessToken), this._jwtDecoder.getExpirationDate(accessToken));
        authentication.user = await this._httpClient.get(backendEndpoints.Identity.USER_INFO, {authentication});

        // save refresh token in a secured token storage, available only in case of device security configuration
        if (await this.getBiometricSupport()) {
            await this._tokenStorage.saveRefreshToken(serverName, authentication.user.name, refreshToken);
        }

        // save authentication info
        await this._authenticationInfoStorage.setLastForServer(serverName, new AuthenticationInfo(authentication.user.name, serverName, new Date()));

        return authentication;
    }

    private createAuthorizationHeader(accessToken: string): { [key: string]: string } {
        return {
            [AUTHORIZATION_HEADER_KEY]: `Bearer ${accessToken}`
        };
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

    private async getBiometricSupport() {
        return (await Keychain.getSupportedBiometryType()) !== null;
    }
}

const authenticationService = new AuthenticationService(jwtDecoder, securedTokenStorage, authenticationInfoStorage, httpClient);
export {authenticationService};
