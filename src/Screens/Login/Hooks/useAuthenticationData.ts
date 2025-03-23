import {useEffect, useState} from 'react';
import {authenticationInfoStorage, ServerInfo, serverInfoStorage} from '../../../Features/DataStorage';
import {useDataStorageEvents} from '../../../Features/DataStorage/Hooks/useDataStorageEvents';
import {DataStorageEventTypes} from '../../../Framework/Data/DataStorage';
import {Platform} from 'react-native';

export const useAuthenticationData = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [serverName, setServerName] = useState<string>('');
    const [servers, setServers] = useState<ServerInfo[]>([]);
    const {subscribe} = useDataStorageEvents(authenticationInfoStorage);

    const initializeServerData = async () => {
        const servers = await serverInfoStorage.getAll();
        setServers(servers);

        const authenticationInfo = await authenticationInfoStorage.getLast();
        if (authenticationInfo) {
            setUsername(authenticationInfo.username);
            const lastServerName = authenticationInfo.serverName;
            if (servers.length > 0 && servers.some(s => s.serverName === lastServerName)) {
                setServerName(lastServerName);
                return;
            }
        }

        if (servers.length > 0) {
            setServerName(servers[0].serverName);
        }
    };

    useEffect(() => {
        async function initializeData() {
            await initializeServerData();

            if (__DEV__) {
                setUsername('root');
                setPassword('111111');
                setServerName(Platform.OS === 'ios' ? 'ios-dev' : 'android-dev');
            }
        }

        initializeData();
        subscribe([DataStorageEventTypes.DataChanged, DataStorageEventTypes.DataCreated, DataStorageEventTypes.DataDeleted], initializeData);
    }, [subscribe]);

    return {servers, username, password, serverName, setUsername, setPassword, setServerName, initializeServerData};
};
