import {useEffect, useState} from 'react';
import {
    applicationSettingsStorage,
    authenticationInfoStorage,
    ServerInfo,
    serverInfoStorage
} from "../../../Features/LocalStorage";
import {LocalStorageEventTypes} from "../../../Framework/Data/LocalStorage";
import {Platform} from "react-native";

export const useAuthenticationData = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [serverName, setServerName] = useState<string>('');
    const [servers, setServers] = useState<ServerInfo[]>([]);

    const initializeServerData = async () => {
        const servers = await serverInfoStorage.getAll();
        setServers(servers);

        // initialize user and server settings
        const authenticationInfo = await authenticationInfoStorage.getLast();
        if (authenticationInfo) {
            setUsername(authenticationInfo.username);

            const lastServerName = authenticationInfo.serverName;
            if (servers.length > 0 && servers.some(s => s.serverName === lastServerName)) {
                setServerName(lastServerName);
            }
        }
    };

    useEffect(() => {
        async function initializeData() {
            if (__DEV__) {
                setUsername('test');
                setPassword('111111');
                setServerName(Platform.OS === 'ios' ? 'ios-dev' : 'android-dev');
            }

            await initializeServerData();
        }

        initializeData();

        applicationSettingsStorage.on(LocalStorageEventTypes.DataCreated, initializeData);
        applicationSettingsStorage.on(LocalStorageEventTypes.DataChanged, initializeData);

        return () => {
            applicationSettingsStorage.off(LocalStorageEventTypes.DataCreated, initializeData);
            applicationSettingsStorage.off(LocalStorageEventTypes.DataChanged, initializeData);
        }
    }, []);

    return {servers, username, password, serverName, setUsername, setPassword, setServerName, initializeServerData};
};
