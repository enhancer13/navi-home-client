import {StorageItem} from '../../../Framework/Data/DataStorage';

export class AuthenticationInfo extends StorageItem {
  public readonly username: string;
  public readonly serverName: string;
  public readonly date: Date;

  constructor(username: string, serverName: string, date: Date) {
    super();

    this.username = username;
    this.serverName = serverName;
    this.date = date;
  }
}
