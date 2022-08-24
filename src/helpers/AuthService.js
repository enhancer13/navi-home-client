import decodeJWT from 'jwt-decode';
import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';
import Storage from './Storage';
import {applicationConstants} from '../config/ApplicationConstants';
import messaging from '@react-native-firebase/messaging';
import {backendEndpoints} from '../config/BackendEndpoints';

class AuthService {
  #timeout = 20000;
  #tokenPrefix = 'Bearer ';
  #accessToken = null;
  #serverAddress = null;
  #ajaxExtraOptions = {
    skipResponse: false,
    skipAuthorization: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  isAccessTokenExpired = () => {
    return (
      this.#accessToken !== null && this.#isTokenExpired(this.#accessToken)
    );
  };

  removeAccessToken = () => {
    this.#accessToken = null;
  };

  logout = async () => {
    try {
      this.removeAccessToken();
      await auth().signOut();
    } catch (ex) {
      console.error(`Unable to perform logout action: ${ex.message}`);
    }
  };

  getAuthorizationHeader = () => {
    return {
      Authorization: this.#tokenPrefix + this.#accessToken,
    };
  };

  buildFetchUrl = (path) => this.#serverAddress + path;

  fetchMethod = async (url, options, extraOptions) => {
    extraOptions =
      typeof extraOptions === 'undefined'
        ? this.#ajaxExtraOptions
        : { ...this.#ajaxExtraOptions, ...extraOptions };
    let headers = extraOptions.headers;
    if (!extraOptions.skipAuthorization) {
      headers = { ...headers, ...this.getAuthorizationHeader() };
    }
    console.log(options.method, url);

    return Promise.race([
      fetch(url, { ...options, headers: headers })
        .then(this.#checkResponse)
        .then((response) => {
          if (extraOptions.skipResponse) {
            return Promise.resolve();
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json();
          }
          return response.text();
        }),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(new Error('Connection timeout, service is unavailable.')),
          this.#timeout
        )
      ),
    ]);
  };

  hasCredentials = async (serverName, username) => {
    const account = this.#getInternetAccount(serverName, username);
    return await Keychain.hasInternetCredentials(account + '_accessToken');
  };

  tryBiometricAuthentication = async (serverName, username) => {
    if (!(await this.hasCredentials(serverName, username))) {
      throw new Error(
        `There is no biometry information for combination of username: ${username} and server: ${serverName}.`
      );
    }
    await Storage.setTextItem(applicationConstants.Authorization.SERVER_NAME, serverName);
    await Storage.setTextItem(applicationConstants.Authorization.USERNAME, username);
    this.#serverAddress = (await Storage.getListItem(applicationConstants.SERVERS)).find(
      (s) => s.serverName === serverName
    ).serverAddress;
    this.#accessToken = await this.#requestAccessToken();
    await this.#tryAuthenticateFirebase();
  };

  tryCredentialsAuthentication = async (serverName, username, password) => {
    await Storage.setTextItem(applicationConstants.Authorization.SERVER_NAME, serverName);
    this.#serverAddress = (await Storage.getListItem(applicationConstants.SERVERS)).find(
      (s) => s.serverName === serverName
    ).serverAddress;
    const url = this.buildFetchUrl(backendEndpoints.Authorization.JWT_LOGIN);
    const data = await this.fetchMethod(
      url,
      {
        method: applicationConstants.httpMethod.POST,
        body: JSON.stringify({
          username,
          password,
        }),
      },
      { skipAuthorization: true }
    );
    await Storage.setTextItem(applicationConstants.Authorization.USERNAME, username);
    const account = this.#getInternetAccount(serverName, username);
    await this.#saveTokenStorage(account, username, data);
    this.#accessToken = data.accessToken;
    await this.#tryAuthenticateFirebase();
  };

  #updateFirebaseClientToken = async (clientToken) => {
    const firebaseAccount = JSON.parse(
      await Storage.getTextItem(applicationConstants.Authorization.FIREBASE_ACCOUNT)
    );
    const url = this.buildFetchUrl(backendEndpoints.SERVICE_ACCOUNTS);
    await this.fetchMethod(
      url,
      {
        method: applicationConstants.httpMethod.PUT,
        body: JSON.stringify({
          clientToken: clientToken,
          id: firebaseAccount.id,
        }),
      },
      { skipResponse: true }
    );
  };

  #tryAuthenticateFirebase = async () => {
    const url = this.buildFetchUrl(backendEndpoints.SERVICE_ACCOUNTS);
    const data = await this.fetchMethod(url, {
      method: applicationConstants.httpMethod.GET,
    });
    if (data.length === 0) {
      throw new Error('There are no accounts linked to current user.');
    }
    const firebaseAccount = data.find(
      (account) => account.serviceAccountType === 'FIREBASE'
    );
    if (!firebaseAccount) {
      throw new Error(
        'There is no FIREBASE account registered for current user.'
      );
    }
    await auth().signInWithEmailAndPassword(
      firebaseAccount.login,
      firebaseAccount.password
    );
    delete firebaseAccount.password;
    await Storage.setTextItem(
      applicationConstants.Authorization.FIREBASE_ACCOUNT,
      JSON.stringify(firebaseAccount)
    );

    messaging()
      .getToken()
      .then((clientToken) => this.#updateFirebaseClientToken(clientToken))
      .catch((ex) => {
        console.log('Unable to set client token.', ex);
      });

    try {
      messaging().onTokenRefresh((clientToken) =>
        this.#updateFirebaseClientToken(clientToken)
      );
    } catch (ex) {
      console.error('Unable to refresh client token.', ex);
    }
  };

  #saveTokenStorage = async (account, username, storage) => {
    //refresh toke is the most sensitive part, use RSA Encryption (with biometrics).
    const optionsRSA = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      storage: Keychain.STORAGE_TYPE.RSA,
      rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
    };
    const refreshTokenAccount = account + '_refreshToken';
    await Keychain.resetInternetCredentials(refreshTokenAccount);
    await Keychain.setInternetCredentials(
      refreshTokenAccount,
      username,
      storage.refreshToken,
      //optionsRSA
    );
    //access token could be stored with AES	Encryption (without human interaction).
    const optionsAES = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      storage: Keychain.STORAGE_TYPE.RSA,
      rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
    };
    const accessTokenAccount = account + '_accessToken';
    await Keychain.resetInternetCredentials(accessTokenAccount);
    await Keychain.setInternetCredentials(
      accessTokenAccount,
      username,
      storage.accessToken,
      //optionsAES
    );
  };

  #getTokenStorage = async (account) => {
    try {
      const refreshTokenAccount = account + '_refreshToken';
      const refreshTokenData = await Keychain.getInternetCredentials(
        refreshTokenAccount,
        {
          authenticationPrompt: {
            title: 'Please verify your identity.',
          },
        }
      );
      if (typeof refreshTokenData === 'boolean') {
        return false;
      }
      const accessTokenAccount = account + '_accessToken';
      const accessTokenData = await Keychain.getInternetCredentials(
        accessTokenAccount
      );
      if (typeof accessTokenData === 'boolean') {
        return false;
      }
      return {
        accessToken: accessTokenData.password,
        refreshToken: refreshTokenData.password,
      };
    } catch (e) {
      if (e.message.includes('code: 13, msg: Cancel')) {
        throw new Error('Canceled');
      } else {
        throw new Error(e.message);
      }
    }
  };

  #getInternetAccount = (serverName, username) => {
    return serverName + '_' + username;
  };

  #requestAccessToken = async () => {
    const username = await Storage.getTextItem(applicationConstants.Authorization.USERNAME);
    const serverName = await Storage.getTextItem(
      applicationConstants.Authorization.SERVER_NAME
    );
    if (this.#accessToken && !this.#isTokenExpired(this.#accessToken)) {
      return this.#accessToken;
    } else if (!username || !serverName) {
      throw new Error(
        'Please authenticate with your credentials before using biometric.'
      );
    }
    const biometricSupport =
      (await Keychain.getSupportedBiometryType()) !== null;
    if (!biometricSupport) {
      throw new Error(
        'Biometry check is not supported or not configured on this device, please authenticate with your credentials.'
      );
    }
    const account = this.#getInternetAccount(serverName, username);
    const tokenStorage = await this.#getTokenStorage(account);
    if (typeof tokenStorage === 'boolean') {
      throw new Error(
        'There is no authentication information stored on this device.'
      );
    }

    if (!this.#isTokenExpired(tokenStorage.accessToken)) {
      return tokenStorage.accessToken;
    }
    if (this.#isTokenExpired(tokenStorage.refreshToken)) {
      await Keychain.resetInternetCredentials(account);
      throw new Error(
        'Session has expired, please authenticate with your credentials.'
      );
    }
    const url = this.buildFetchUrl(backendEndpoints.Authorization.JWT_TOKEN_REFRESH);
    const data = await this.fetchMethod(
      url,
      {
        method: applicationConstants.httpMethod.PUT,
        body: JSON.stringify({
          accessToken: tokenStorage.accessToken,
          refreshToken: tokenStorage.refreshToken,
        }),
      },
      { skipAuthorization: true }
    );
    await this.#saveTokenStorage(account, username, data);
    return data.accessToken;
  };

  #isTokenExpired = (value) => {
    try {
      const decoded = decodeJWT(value);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  #checkResponse = async (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    let errorMessage =
      response.url + '\n' + 'Status code: ' + response.status + '\n';
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      errorMessage +=
        typeof data.error !== 'undefined'
          ? data.error
          : data.message + ' - ' + data.details;
    } else {
      errorMessage += 'Unknown error.';
    }
    throw new Error(errorMessage);
  };
}

const authService = new AuthService();

export default authService;
