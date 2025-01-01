import DataStorage from '../../../Framework/Data/DataStorage/DataStorage';
import {ServerInfo} from './ServerInfo';

class ServerInfoStorage extends DataStorage<ServerInfo> {
    constructor() {
        super('servers_info');
    }
}

export const serverInfoStorage = new ServerInfoStorage();
