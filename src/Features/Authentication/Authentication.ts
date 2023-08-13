import {IUserInfo} from '../../BackendTypes';

export class Authentication {
  private _user!: IUserInfo;
  private _firebaseAccountId!: number;
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

  get user(): IUserInfo {
    return this._user;
  }

  set user(value: IUserInfo) {
    this._user = value;
  }

  get firebaseAccountId(): number {
    return this._firebaseAccountId;
  }

  set firebaseAccountId(value: number) {
    this._firebaseAccountId = value;
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
