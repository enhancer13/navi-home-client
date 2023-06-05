import {IUserRole} from './IUserRole';
import {IEntity} from './IEntity';

export interface IUser extends IEntity {
  username: string;

  password: string;

  email: string;

  admin: boolean;

  userRoles: IUserRole[];
}
