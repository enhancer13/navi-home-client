import {StorageItem} from "../../../Framework/Data/LocalStorage";

export class ServerInfo extends StorageItem {
    public readonly serverName: string;

    public readonly serverAddress: string;

    constructor(serverName: string, serverAddress: string) {
        super();

        this.serverName = serverName;
        this.serverAddress = serverAddress;
    }
}
