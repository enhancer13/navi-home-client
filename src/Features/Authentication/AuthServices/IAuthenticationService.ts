import {Authentication} from '../Authentication';

export interface IAuthenticationService {
  authenticateByCredentials(serverName: string, serverAddress: string): Promise<Authentication>;

  authenticateByBiometric(username: string, serverName: string, serverAddress: string): Promise<Authentication>;
}
