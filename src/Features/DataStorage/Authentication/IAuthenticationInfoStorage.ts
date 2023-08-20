import {AuthenticationInfo} from './AuthenticationInfo';
import IDataStorage from '../../../Framework/Data/DataStorage/IDataStorage';

export interface IAuthenticationInfoStorage extends IDataStorage<AuthenticationInfo> {
  getLast(): Promise<AuthenticationInfo | null>;

  getLastForServer(serverName: string): Promise<AuthenticationInfo | null>;

  setLastForServer(serverName: string, data: AuthenticationInfo): Promise<void>;
}
