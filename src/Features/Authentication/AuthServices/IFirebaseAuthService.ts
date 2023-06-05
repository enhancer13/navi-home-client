import Authentication from '../Authentication';

export interface IFirebaseAuthService {
  signIn(authentication: Authentication): Promise<void>;

  signOut(): Promise<void>;
}

