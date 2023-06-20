import {StorageItem} from '../../../Framework/Data/DataStorage';

export class AuthenticationInfo extends StorageItem {
  public readonly username: string;
  public readonly serverName: string;

  constructor(username: string, serverName: string) {
    super();

    this.username = username;
    this.serverName = serverName;
  }
}
