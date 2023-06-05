import {IUser} from './IUser';
import {IEntity} from './IEntity';
import {ServiceAccountTypes} from "./Enums/ServiceAccountTypes";

export interface IServiceAccount extends IEntity {
  accountName: string;

  description: string;

  login: string;

  password: string;

  serviceAccountType: ServiceAccountTypes;

  clientToken: string;

  user: IUser;
}
