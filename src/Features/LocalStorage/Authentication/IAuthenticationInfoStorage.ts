import {AuthenticationInfo} from './AuthenticationInfo';
import ILocalStorage from '../../../Framework/Data/LocalStorage/ILocalStorage';

export interface IAuthenticationInfoStorage extends ILocalStorage<AuthenticationInfo> {
  getLast(): Promise<AuthenticationInfo | null>;

  setLast(data: AuthenticationInfo): Promise<void>;
}
