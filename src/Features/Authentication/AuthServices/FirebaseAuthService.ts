import auth from '@react-native-firebase/auth';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import messaging from '@react-native-firebase/messaging';
import {IFirebaseAuthService} from './IFirebaseAuthService';
import {Authentication} from '../Authentication';
import IHttpClient from '../../../Framework/Net/HttpClient/IHttpClient';
import {IServiceAccount, ServiceAccountTypes} from '../../../BackendTypes';
import {httpClient} from "../../../Framework/Net/HttpClient/HttpClient";

export class FirebaseAuthService implements IFirebaseAuthService {
  private readonly _httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  public async signIn(authentication: Authentication): Promise<void> {
    const serviceAccounts = await this._httpClient.get<IServiceAccount[]>(backendEndpoints.SERVICE_ACCOUNTS, {authentication});
    if (serviceAccounts.length === 0) {
      throw new Error('There are no accounts linked to current user.');
    }

    const firebaseAccount = serviceAccounts.find((account: IServiceAccount) => account.serviceAccountType === ServiceAccountTypes.FIREBASE);
    if (!firebaseAccount) {
      throw new Error('There is no Firebase account registered for current user.');
    }

    try {
      await auth().signInWithEmailAndPassword(firebaseAccount.login, firebaseAccount.password);
      if (__DEV__) {
        await messaging().setAPNSToken('test');
      }

      const clientToken = await messaging().getToken();
      await this.updateClientToken(firebaseAccount, clientToken, authentication);
    } catch (ex) {
      console.error('Unable to authenticate to Firebase account.', ex);
    }

    messaging().onTokenRefresh(clientToken => this.updateClientToken(firebaseAccount, clientToken, authentication));
  }

  public async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (ex) {
      console.error('Unable to perform logout from Firebase account', ex);
    }
  }

  private async updateClientToken(firebaseAccount: IServiceAccount, clientToken: string, authentication: Authentication) {
    const payload = JSON.stringify({clientToken, id: firebaseAccount.id});
    await this._httpClient.put(backendEndpoints.SERVICE_ACCOUNTS, {body: payload, authentication});
  }
}

const firebaseAuthService= new FirebaseAuthService(httpClient);
export {firebaseAuthService};

