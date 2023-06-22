import ISecuredTokenStorage from "../../../../src/Features/Authentication/SecuredStorage/ISecuredTokenStorage";
import IHttpClient from "../../../../src/Framework/Net/HttpClient/IHttpClient";
import {ITokenPair, IUser} from "../../../../src/BackendTypes";
import {BackendAuthService} from "../../../../src/Features/Authentication/AuthServices/BackendAuthService";
import {IJwtDecoder} from "../../../../src/Features/Authentication/Helpers/IJwtDecoder";
import Keychain from "react-native-keychain";
import {Authentication} from "../../../../src/Features/Authentication";

const tokenStorageMock: jest.Mocked<ISecuredTokenStorage> = {
    saveTokenPair: jest.fn(),
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
    isExpired: jest.fn(),
}

const tokenPair: ITokenPair = {
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NTk4LCJqdGkiOiJiZWNjNmE2ZC1jNzFmLTQwMTktYmI1Ny0zNjEyMmQ4MDY1NDMifQ.EBJ5QGn7eJ0f4C625eVotFBeixXxa3GmimHLR_gdKKY',
    refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NjI4LCJqdGkiOiJmNjVhOTVjMC1jMWZhLTQzY2YtYTgwMy1lOWY0ZjU3YTQ4MDkifQ.as7DLXmJQxgv1b9w-l-qQmuh4jZ5XWZaqEIMrWBtIrI',
};

const serverName = 'testServer';
const serverAddress = 'https://myserver.com';
const username = 'testUser';
const password = 'testPassword';

describe('BackendAuthService', () => {
    let authService: BackendAuthService;

    beforeEach(() => {
        authService = new BackendAuthService(jwtDecoderMock, tokenStorageMock, httpClientMock);
        jest.resetAllMocks();
        jest.resetModules()
    });

    describe('authenticateByCredentials', () => {
        it('should send user credentials to jwt authentication endpoint', async () => {
            // Arrange
            const expectedUser: IUser = {
                id: 1,
                username: 'testUsername',
                admin: false,
                email: "",
                password: "testPassword",
                userRoles: []
            };
            httpClientMock.put.mockResolvedValue(tokenPair);
            httpClientMock.get.mockResolvedValue(expectedUser);

            // Act
            await authService.authenticateByCredentials(username, password, serverName, serverAddress);

            // Assert
            expect(httpClientMock.put).toHaveBeenCalledWith( "https://myserver.com/api/jwt/auth/login", {"body": "{\"username\":\"testUser\",\"password\":\"testPassword\"}"});
        });

        it('should request authenticated user and return an authentication object', async () => {
            // Arrange
            const expectedUser: IUser = {
                id: 1,
                username: 'testUsername',
                admin: false,
                email: "",
                password: "testPassword",
                userRoles: []
            };
            httpClientMock.put.mockResolvedValue(tokenPair);
            httpClientMock.get.mockResolvedValue(expectedUser);

            // Act
            const authentication = await authService.authenticateByCredentials(username, password, serverName, serverAddress);

            // Assert
            expect(httpClientMock.get).toHaveBeenCalledWith("/api/jwt/authentication/info/user", {authentication});
            expect(authentication.user).toEqual(expectedUser);
        });

        it('should save the token pair to secured storage after successfully authentication', async () => {
            // Arrange
            const expectedUser: IUser = {
                id: 1,
                username: 'testUsername',
                admin: false,
                email: "",
                password: "testPassword",
                userRoles: []
            };
            httpClientMock.put.mockResolvedValue(tokenPair);
            httpClientMock.get.mockResolvedValue(expectedUser);

            // Act
            await authService.authenticateByCredentials(username, password, serverName, serverAddress);

            // Assert
            expect(tokenStorageMock.saveTokenPair).toHaveBeenCalledWith(serverName, username, tokenPair);
        });
    });

    describe('authenticateByBiometric', () => {
        it('should throw an error if biometry authentication is not supported', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue(null);

            // Act and Assert
            await expect(authService.authenticateByBiometric(username, serverName, serverAddress)).rejects.toThrow('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        });

        it('should return authentication if access token is not expired', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValue(false);

            // Act
            const authentication = await authService.authenticateByBiometric(username, serverName, serverAddress);

            // Assert
            expect(authentication).toBeInstanceOf(Authentication);
        });

        it('should request a new token pair if access token is expired but refresh token is not', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValueOnce(true).mockReturnValueOnce(false);
            httpClientMock.put.mockResolvedValue(tokenPair);

            // Act
            const authentication = await authService.authenticateByBiometric(username, serverName, serverAddress);

            // Assert
            expect(httpClientMock.put).toHaveBeenCalledWith("https://myserver.com/api/jwt/users/token/refresh", {"body": "{\"accessToken\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NTk4LCJqdGkiOiJiZWNjNmE2ZC1jNzFmLTQwMTktYmI1Ny0zNjEyMmQ4MDY1NDMifQ.EBJ5QGn7eJ0f4C625eVotFBeixXxa3GmimHLR_gdKKY\",\"refreshToken\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgwMjk0NjI4LCJqdGkiOiJmNjVhOTVjMC1jMWZhLTQzY2YtYTgwMy1lOWY0ZjU3YTQ4MDkifQ.as7DLXmJQxgv1b9w-l-qQmuh4jZ5XWZaqEIMrWBtIrI\"}"});
            expect(authentication).toBeInstanceOf(Authentication);
        });

        it('should remove token pair and throw an error if both access and refresh tokens are expired', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockReturnValue(true);

            // Act and Assert
            await expect(authService.authenticateByBiometric(username, serverName, serverAddress)).rejects.toThrow('Session has expired, please authenticate with your credentials.');
            expect(tokenStorageMock.removeTokenPair).toHaveBeenCalledWith(serverName, username);
        });

        it('should throw an error when biometry is not supported', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(authService.authenticateByBiometric(username, serverName, serverAddress)).rejects.toThrow('Biometry authentication is not supported or not configured on this device, please authenticate with your credentials');
        });

        it('should throw an error when both access token and refresh token are expired', async () => {
            // Arrange
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation(() => true);

            // Act & Assert
            await expect(authService.authenticateByBiometric(username, serverName, serverAddress)).rejects.toThrow('Session has expired, please authenticate with your credentials.');
        });

        it('should throw an error when server returns an error during token refresh process', async () => {
            // Arrange
            const serverErrorMessage = 'Unauthorized';
            (Keychain.getSupportedBiometryType as jest.Mock).mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation((token) => token === tokenPair.accessToken);
            httpClientMock.put.mockRejectedValue(new Error(serverErrorMessage));

            // Act & Assert
            await expect(authService.authenticateByBiometric(username, serverName, serverAddress)).rejects.toThrow(serverErrorMessage);
        });

        it('should update the token pair in secured storage after successfully refreshing tokens', async () => {
            // Arrange
            Keychain.getSupportedBiometryType = jest.fn().mockResolvedValue('FaceID');
            tokenStorageMock.hasAccessToken.mockResolvedValue(true);
            tokenStorageMock.getAccessToken.mockResolvedValue(tokenPair.accessToken);
            tokenStorageMock.getRefreshToken.mockResolvedValue(tokenPair.refreshToken);
            jwtDecoderMock.isExpired.mockImplementation((token) => {
                if (token === tokenPair.accessToken) {
                    return true;
                } else if (token === tokenPair.refreshToken) {
                    return false;
                }
                return false;
            });
            const newTokenPair = {
                accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgxMDYzOTg5LCJqdGkiOiJkMTg1ODJlNi0wNWEzLTQxZGItYWJhYi1iZjI2ODNmMzMyMTYifQ.DumQKK8d9P6Hu9tSseR7gNNgtmA2nQbbQK7uW76B420",
                refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjgxNjY2OTg5LCJqdGkiOiI5OGNkNTJkMC0yOWYzLTRkNjgtOTU1NC03ZGQxMWIxNmJjNjYifQ.FSP4QiMIoM82touSxTJ0K1X9UOLYdLQcz7NIpcx8QFE"
            }
            httpClientMock.put.mockResolvedValue(newTokenPair);

            // Act
            await authService.authenticateByBiometric(username, serverName, serverAddress);

            // Assert
            expect(tokenStorageMock.saveTokenPair).toHaveBeenCalledWith(serverName, username, newTokenPair);
        });
    });

    it('should throw an error if fetching user information fails', async () => {
        // Arrange
        const errorMessage = 'Error fetching user information';
        httpClientMock.put.mockResolvedValue(tokenPair);
        httpClientMock.get.mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(authService.authenticateByCredentials(username, password, serverName, serverAddress)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if saving the token pair to secured storage fails', async () => {
        // Arrange
        const errorMessage = 'Error saving token pair to secured storage';
        httpClientMock.put.mockResolvedValue(tokenPair);
        tokenStorageMock.saveTokenPair.mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(authService.authenticateByCredentials(username, password, serverName, serverAddress)).rejects.toThrow(errorMessage);
    });
});
