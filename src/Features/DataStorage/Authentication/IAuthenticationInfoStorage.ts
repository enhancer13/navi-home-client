import {AuthenticationInfo} from './AuthenticationInfo';
import IDataStorage from '../../../Framework/Data/DataStorage/IDataStorage';

export interface IAuthenticationInfoStorage extends IDataStorage<AuthenticationInfo> {
  getLast(): Promise<AuthenticationInfo | null>;

  setLast(data: AuthenticationInfo): Promise<void>;
}
