import {IEntity} from './IEntity';
import {UserRoles} from './Enums/UserRoles';

export interface IUserRole extends IEntity {
  userRole: UserRoles;
}
