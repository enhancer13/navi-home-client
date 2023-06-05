import Authentication from '../Authentication';

export interface IBackendAuthService {
  authenticateByCredentials(username: string, password: string, serverName: string, serverAddress: string): Promise<Authentication>;

  authenticateByBiometric(username: string, serverName: string, serverAddress: string): Promise<Authentication>;
}
