export default interface ISecuredTokenStorage {
  saveRefreshToken(serverName: string, username: string, refreshToken: string): Promise<void>;

  getRefreshToken(serverName: string, username: string): Promise<string>;

  removeRefreshToken(serverName: string, username: string): Promise<void>;

  hasRefreshToken(serverName: string, username: string): Promise<boolean>;
}
