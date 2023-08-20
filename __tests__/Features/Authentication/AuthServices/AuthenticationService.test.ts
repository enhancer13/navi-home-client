import ISecuredTokenStorage from "../../../../src/Features/Authentication/SecuredStorage/ISecuredTokenStorage";
import IHttpClient from "../../../../src/Framework/Net/HttpClient/IHttpClient";
import {IUserInfo} from "../../../../src/BackendTypes";
import {AuthenticationService} from "../../../../src/Features/Authentication/AuthServices/AuthenticationService";
import {IJwtDecoder} from "../../../../src/Features/Authentication/Helpers/IJwtDecoder";
import Keychain from "react-native-keychain";
import {Authentication} from "../../../../src/Features/Authentication";
import {authorize, refresh} from "react-native-app-auth";
import {backendEndpoints} from "../../../../src/Config/BackendEndpoints";

const tokenStorageMock: jest.Mocked<ISecuredTokenStorage> = {
    saveRefreshToken: jest.fn(),
    getTokenPair: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    hasAccessToken: jest.fn(),
    removeTokenPair: jest.fn(),
};

const httpClientMock: jest.Mocked<IHttpClient> = {
    put: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    send: jest.fn()
};

const jwtDecoderMock: jest.Mocked<IJwtDecoder> = {
    getExpirationDate: jest.fn(),
    isExpired: jest.fn()
}

const authenticateResult: ITokenPair = {
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NTk4LCJqdGkiOiJiZWNjNmE2ZC1jNzFmLTQwMTktYmI1Ny0zNjEyMmQ4MDY1NDMifQ.EBJ5QGn7eJ0f4C625eVotFBeixXxa3GmimHLR_gdKKY',
    refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NjI4LCJqdGkiOiJmNjVhOTVjMC1jMWZhLTQzY2YtYTgwMy1lOWY0ZjU3YTQ4MDkifQ.as7DLXmJQxgv1b9w-l-qQmuh4jZ5XWZaqEIMrWBtIrI',
};

const serverName = 'testServer';
const serverAddress = 'https://myserver.com';
const username = 'testUsername';
const userInfo: IUserInfo = {
    sub: "",
    name: 'testUsername',
    email: "",
    role: [],
    email_verified: false,
    preferred_username: "",
};

describe('AuthService', () => {
    let authService: AuthenticationService;

    beforeEach(() => {
        authService = new AuthenticationService(jwtDecoderMock, tokenStorageMock, httpClientMock);
        jest.resetAllMocks();
        jest.resetModules()
        httpClientMock.get.mockResolvedValue(userInfo);
        (authorize as jest.Mock).mockResolvedValue(authenticateResult);
    });

    describe('authenticateByCredentials', () => {
        it('should pass identity server address and connect token path to authenticate request', async () => {
            // Act
            await authService.initiateCredentialsAuthentication(serverName, serverAddress);

            // Assert
            const expectedAuthenticateConfig = {
                issuer: serverAddress + backendEndpoints.Identity.URL,
            }
            expect((authorize as jest.Mock)).toHaveBeenCalledWith(
                expect.objectContaining(expectedAuthenticateConfig)
            );
        });

        it('should request the following scopes: "openid", "email", "profile", "roles", "offline_access"', async () => {
            // Act
            await authService.initiateCredentialsAuthentication(serverName, serverAddress);

            // Assert
            const expectedAuthenticateConfig = {
                scopes: ['openid', 'email', 'profile', 'roles', 'offline_access'],
            }
            expect((authorize as jest.Mock)).toHaveBeenCalledWith(
                expect.objectContaining(expectedAuthenticateConfig)
            );
        });

        it('should save the access and refresh tokens to secured storage', async () => {
            // Act
            await authService.initiateCredentialsAuthentication(serverName, serverAddress);

            // Assert
            expect(tokenStorageMock.saveRefreshToken).toHaveBeenCalledWith(serverName, userInfo.name, { accessToken: authenticateResult.accessToken, refreshToken: authenticateResult.refreshToken });
        });

        it('should request authenticated user and return an authentication object', async () => {
            httpClientMock.get.mockResolvedValue(userInfo);

            // Act
            const authentication = await authService.initiateCredentialsAuthentication(serverName, serverAddress);

            // Assert
            expect(httpClientMock.get).toHaveBeenCalledWith(backendEndpoints.Identity.USER_INFO, {authentication});
            expect(authentication.user).toEqual(userInfo);
        });
    });

    describe('authenticateByBiometric', () => {
        it('should throw an error if biometry authentication is not supported', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue(null);

            // Act and Assert
            await expect(authService.initiateBiometricAuthentication(username, serverName, serverAddress)).rejects.toThrow('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        });

        it('should return authentication if access token is not expired', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValue(false);

            // Act
            const authentication = await authService.initiateBiometricAuthentication(username, serverName, serverAddress);

            // Assert
            expect(authentication).toBeInstanceOf(Authentication);
        });

        it('should request a new token pair if access token is expired but refresh token is not', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValueOnce(true).mockReturnValueOnce(false);
            const authorizeResult = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            };
            (refresh as jest.Mock).mockResolvedValue(authorizeResult);

            // Act
            const authentication = await authService.initiateBiometricAuthentication(username, serverName, serverAddress);

            // Assert
            expect((refresh as jest.Mock)).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({refreshToken: authenticateResult.refreshToken})
            )
            expect(authentication).toBeInstanceOf(Authentication);
        });

        it('should remove token pair and throw an error if both access and refresh tokens are expired', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValue(true);

            // Act and Assert
            await expect(authService.initiateBiometricAuthentication(username, serverName, serverAddress)).rejects.toThrow('Session has expired, please authenticate with your credentials.');
            expect(tokenStorageMock.removeTokenPair).toHaveBeenCalledWith(serverName, username);
        });

        it('should throw an error when biometry is not supported', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(authService.initiateBiometricAuthentication(username, serverName, serverAddress)).rejects.toThrow('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        });

        it('should throw an error when both access token and refresh token are expired', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation(() => true);

            // Act & Assert
            await expect(authService.initiateBiometricAuthentication(username, serverName, serverAddress)).rejects.toThrow('Session has expired, please authenticate with your credentials.');
        });

        it('should throw an error when server returns an error during token refresh process', async () => {
            // Arrange
            const serverErrorMessage = 'Unauthorized';
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation((token) => token === authenticateResult.accessToken);
            (refresh as jest.Mock).mockRejectedValue(new Error(serverErrorMessage));

            // Act & Assert
            await expect(authService.initiateBiometricAuthentication(username, serverName, serverAddress)).rejects.toThrow(serverErrorMessage);
        });

        it('should update the token pair in secured storage after successfully refreshing tokens', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(authenticateResult.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(authenticateResult.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation((token) => {
                if (token === authenticateResult.accessToken) {
                    return true;
                } else if (token === authenticateResult.refreshToken) {
                    return false;
                }
                return false;
            });
            const authorizeResult = {
                accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgxMDYzOTg5LCJqdGkiOiJkMTg1ODJlNi0wNWEzLTQxZGItYWJhYi1iZjI2ODNmMzMyMTYifQ.DumQKK8d9P6Hu9tSseR7gNNgtmA2nQbbQK7uW76B420",
                refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgxNjY2OTg5LCJqdGkiOiI5OGNkNTJkMC0yOWYzLTRkNjgtOTU1NC03ZGQxMWIxNmJjNjYifQ.FSP4QiMIoM82touSxTJ0K1X9UOLYdLQcz7NIpcx8QFE"
            };
            (refresh as jest.Mock).mockResolvedValue(authorizeResult);

            // Act
            await authService.initiateBiometricAuthentication(username, serverName, serverAddress);

            // Assert
            expect(tokenStorageMock.saveRefreshToken).toHaveBeenCalledWith(serverName, username, authorizeResult);
        });
    });

    it('should throw an error if fetching user information fails', async () => {
        // Arrange
        const errorMessage = 'Error fetching user information';
        httpClientMock.get.mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(authService.initiateCredentialsAuthentication(serverName, serverAddress)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if saving the token pair to secured storage fails', async () => {
        // Arrange
        const errorMessage = 'Error saving token pair to secured storage';
        tokenStorageMock.saveRefreshToken.mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(authService.initiateCredentialsAuthentication(serverName, serverAddress)).rejects.toThrow(errorMessage);
    });
});
