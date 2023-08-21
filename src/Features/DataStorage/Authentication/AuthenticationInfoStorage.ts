import {IAuthenticationInfoStorage} from './IAuthenticationInfoStorage';
import {AuthenticationInfo} from './AuthenticationInfo';
import DataStorage from '../../../Framework/Data/DataStorage/DataStorage';

class AuthenticationInfoStorage extends DataStorage<AuthenticationInfo> implements IAuthenticationInfoStorage {
    constructor() {
        super('authentication_info');
    }

    async getLast(): Promise<AuthenticationInfo | null> {
        let items = await this.getAll();
        items = items.sort((a, b) => b.date.getTime() - a.date.getTime());
        return items.length === 1 ? items[0] : null;
    }

    async getLastForServer(serverName: string): Promise<AuthenticationInfo | null> {
        const items = await this.getAllBy(x => x.serverName === serverName);
        if (items.length > 1) {
            throw new Error('Authentication info repository cannot contain more than one record for the same server');
        }
        return items.length === 1 ? items[0] : null;
    }

    async setLastForServer(serverName: string, data: AuthenticationInfo): Promise<void> {
        await this.deleteBy(x => x.serverName === data.serverName);
        await this.save(data);
    }
}

export const authenticationInfoStorage = new AuthenticationInfoStorage();
