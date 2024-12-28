import {Authentication} from '../Authentication';
import {IServiceAccount} from '../../../BackendTypes';

export interface IFirebaseAuthService {
  signIn(authentication: Authentication): Promise<IServiceAccount>;

  signOut(): Promise<void>;

  updateClientToken(firebaseAccountId: number, clientToken: string, authentication: Authentication): Promise<void>;
}

