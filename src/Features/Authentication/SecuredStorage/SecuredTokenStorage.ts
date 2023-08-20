import Keychain, {Options, SharedWebCredentials} from 'react-native-keychain';
import ISecuredTokenStorage from './ISecuredTokenStorage';

class SecuredTokenStorage implements ISecuredTokenStorage {
  private static readonly _optionsRSA: Options = {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    storage: Keychain.STORAGE_TYPE.RSA, // use RSA Encryption (with biometrics).
    rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
  };

  public async saveRefreshToken(serverName: string, username: string, refreshToken: string): Promise<void> {
    const refreshTokenKey = this.getRefreshTokenKey(serverName, username);
    await Keychain.resetInternetCredentials(refreshTokenKey);
    await Keychain.setInternetCredentials(refreshTokenKey, username, refreshToken, SecuredTokenStorage._optionsRSA);
  }

  public async getRefreshToken(serverName: string, username: string): Promise<string> {
    const refreshTokenKey = this.getRefreshTokenKey(serverName, username);
    const options = {
      authenticationPrompt: {
        title: 'Please verify your identity.'
      }
    };
    const sharedWebCredentials = await this.getInternetCredentials(refreshTokenKey, options);
    if (typeof sharedWebCredentials === 'boolean') {
      throw new Error('Refresh token data is not found');
    }

    return sharedWebCredentials.password;
  }

  public async removeRefreshToken(serverName: string, username: string): Promise<void> {
    await Keychain.resetInternetCredentials(this.getRefreshTokenKey(serverName, username));
  }

  public async hasRefreshToken(serverName: string, username: string): Promise<boolean> {
    const refreshTokenKey = this.getRefreshTokenKey(serverName, username);
    return !!(await Keychain.hasInternetCredentials(refreshTokenKey));
  }

  private async getInternetCredentials(tokenKey: string, options?: Options): Promise<false | SharedWebCredentials> {
    try {
      return await Keychain.getInternetCredentials(tokenKey, options);
    } catch (error: any) {
      const message = error.message;
      if (message.includes('code: 13, msg: Cancel')) {
        throw new Error('Canceled');
      } else {
        throw new Error(message);
      }
    }
  }

  private getRefreshTokenKey(serverName: string, username: string): string {
    return `${serverName}_${username}_refreshToken`;
  }
}

export const securedTokenStorage = new SecuredTokenStorage();
