import LocalStorage from '../../../Framework/Data/LocalStorage/LocalStorage';
import {ServerInfo} from "./ServerInfo";

class ServerInfoStorage extends LocalStorage<ServerInfo> {
    constructor() {
        super('servers_info');
    }
}

export const serverInfoStorage = new ServerInfoStorage();
