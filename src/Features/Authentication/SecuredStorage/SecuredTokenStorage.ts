import Keychain, {Options, SharedWebCredentials} from 'react-native-keychain';
import ISecuredTokenStorage from './ISecuredTokenStorage';
import {ITokenPair} from '../../../BackendTypes';

class SecuredTokenStorage implements ISecuredTokenStorage {
  public async saveTokenPair(serverName: string, username: string, tokenPair: ITokenPair): Promise<void> {
    //refresh toke is the most sensitive part, use RSA Encryption (with biometrics).
    const optionsRSA = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      storage: Keychain.STORAGE_TYPE.RSA,
      rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
    };
    const refreshTokenKey = this.getRefreshTokenKey(serverName, username);
    await Keychain.resetInternetCredentials(refreshTokenKey);
    await Keychain.setInternetCredentials(refreshTokenKey, username, tokenPair.refreshToken, optionsRSA);

    //access token could be stored with AES	Encryption (without human interaction).
    const optionsAES = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      storage: Keychain.STORAGE_TYPE.AES,
      rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
    };
    const accessTokenKey = this.getAccessTokenKey(serverName, username);
    await Keychain.resetInternetCredentials(accessTokenKey);
    await Keychain.setInternetCredentials(accessTokenKey, username, tokenPair.accessToken, optionsAES);
  }

  public async getTokenPair(serverName: string, username: string): Promise<ITokenPair> {
    const refreshToken = await this.getRefreshToken(serverName, username);
    const accessToken = await this.getAccessToken(serverName, username);
    return {
      accessToken,
      refreshToken
    };
  }

  public async getAccessToken(serverName: string, username: string): Promise<string> {
    const accessTokenKey = this.getAccessTokenKey(serverName, username);
    const accessTokenData = await this.getInternetCredentials(accessTokenKey);
    if (typeof accessTokenData === 'boolean') {
      throw new Error('Access token data is not found');
    }

    return accessTokenData.password;
  }

  public async getRefreshToken(serverName: string, username: string): Promise<string> {
    const refreshTokenKey = this.getRefreshTokenKey(serverName, username);
    const options = {
      authenticationPrompt: {
        title: 'Please verify your identity.'
      }
    };
    const refreshTokenData = await this.getInternetCredentials(refreshTokenKey, options);
    if (typeof refreshTokenData === 'boolean') {
      throw new Error('Refresh token data is not found');
    }

    return refreshTokenData.password;
  }

  public async hasAccessToken(serverName: string, username: string): Promise<boolean> {
    const accessTokenKey = this.getAccessTokenKey(serverName, username);
    return !!(await Keychain.hasInternetCredentials(accessTokenKey));
  }

  public async removeTokenPair(serverName: string, username: string): Promise<void> {
    await Keychain.resetInternetCredentials(this.getAccessTokenKey(serverName, username));
    await Keychain.resetInternetCredentials(this.getRefreshTokenKey(serverName, username));
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

  private getAccessTokenKey(serverName: string, username: string): string {
    return serverName + '_' + username + '_accessToken';
  }

  private getRefreshTokenKey(serverName: string, username: string): string {
    return serverName + '_' + username + '_refreshToken';
  }
}

export const securedTokenStorage = new SecuredTokenStorage();
