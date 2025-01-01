import {ITokenPair} from '../../../BackendTypes';

export default interface ISecuredTokenStorage {
  saveTokenPair(serverName: string, username: string, tokenPair: ITokenPair): Promise<void>;

  getTokenPair(serverName: string, username: string): Promise<ITokenPair>;

  getAccessToken(serverName: string, username: string): Promise<string>;

  getRefreshToken(serverName: string, username: string): Promise<string>;

  removeTokenPair(serverName: string, username: string): Promise<void>;

  hasAccessToken(serverName: string, username: string): Promise<boolean>;
}
