import {IUser} from '../../BackendTypes';

export class Authentication {
  private _user!: IUser;
  private readonly _serverName: string;
  private readonly _serverAddress: string;
  private readonly _authorizationHeader: { [key: string]: string } | undefined;
  private readonly _expirationDateTime: Date;

  constructor(serverName: string, serverAddress: string, authorizationHeader: { [key: string]: string } | undefined, expirationDateTime: Date) {
    this._serverName = serverName;
    this._serverAddress = serverAddress;
    this._authorizationHeader = authorizationHeader;
    this._expirationDateTime = expirationDateTime;
  }

  get user(): IUser {
    return this._user;
  }

  set user(value: IUser) {
    this._user = value;
  }

  get authorizationHeader(): { [key: string]: string } | undefined {
    return this._authorizationHeader;
  }

  get expirationDateTime(): Date {
    return this._expirationDateTime;
  }

  get serverAddress(): string {
    return this._serverAddress;
  }

  get serverName(): string {
    return this._serverName;
  }
}
