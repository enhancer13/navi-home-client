import {ITokenPair} from "../../../BackendTypes";

export default interface ISecuredTokenStorage {
  saveTokenPair(serverName: string, username: string, tokenPair: ITokenPair): Promise<void>;

  getTokenPair(serverName: string, username: string): Promise<ITokenPair>;

  removeTokenPair(serverName: string, username: string): Promise<void>;

  hasAccessToken(serverName: string, username: string): Promise<boolean>;
}
