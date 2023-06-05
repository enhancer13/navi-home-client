import {IAuthenticationInfoStorage} from './IAuthenticationInfoStorage';
import {AuthenticationInfo} from './AuthenticationInfo';
import LocalStorage from '../../../Framework/Data/LocalStorage/LocalStorage';

class AuthenticationInfoStorage extends LocalStorage<AuthenticationInfo> implements IAuthenticationInfoStorage {
    constructor() {
        super('authentication_info');
    }

    async getLast(): Promise<AuthenticationInfo | null> {
        const items = await this.getAll();
        if (items.length > 1) {
            throw new Error('Authentication info repository cannot contain more than one record');
        }
        return items.length === 1 ? items[0] : null;
    }

    async setLast(data: AuthenticationInfo): Promise<void> {
        await this.deleteAll();
        await this.save(data);
    }
}

export const authenticationInfoStorage = new AuthenticationInfoStorage();
