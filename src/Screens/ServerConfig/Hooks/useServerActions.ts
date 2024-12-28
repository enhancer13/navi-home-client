import {ServerInfo, serverInfoStorage} from '../../../Features/DataStorage';
import {httpClient} from '../../../Framework/Net/HttpClient/HttpClient';
import {IApplicationInfo} from '../../../BackendTypes';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {useEffect, useState} from 'react';
import {usePopupMessage} from '../../../Features/Messaging';
import {useNavigation} from '@react-navigation/native';


export const useServerActions = (serverInfo: ServerInfo) => {
    const [busy, setBusy] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const { showSuccess, showError } = usePopupMessage();
    const navigation = useNavigation();

    useEffect(() => {
        return () => abortController?.abort();
    }, [abortController]);

    const doAdd = async () => {
        if (!tryValidateServerInfo()) {
            return;
        }

        const servers = await serverInfoStorage.getAll();
        if (servers.some((s) => s.serverName === serverInfo.serverName)) {
            showError(`Unable to save server configuration, cause server name: ${serverInfo.serverName} already exists.`);
            return;
        }
        await serverInfoStorage.save(serverInfo);
        navigation.navigate('Login' as never);
    };

    const doEdit = async () => {
        if (!tryValidateServerInfo()) {
            return;
        }

        await serverInfoStorage.update(serverInfo);
        navigation.navigate('Login' as never);
    };

    const doDelete = async () => {
        await serverInfoStorage.delete(serverInfo);
        navigation.navigate('Login' as never);
    };

    const doConnectionTest = async () => {
        if (!tryValidateServerInfo()) {
            return;
        }

        const abortController = new AbortController();
        setAbortController(abortController);
        try {
            setBusy(true);
            const applicationInfo = await httpClient.get<IApplicationInfo>(serverInfo.serverAddress + backendEndpoints.APPLICATION_INFO, {signal: abortController.signal});
            showSuccess(applicationInfo.name + '\nversion: ' + applicationInfo.version + '\nbuild: ' + applicationInfo.build);
        } catch (error: any) {
            if (abortController.signal.aborted) {
                return;
            }
            showError(error.message);
        } finally {
            setBusy(false);
        }
    };

    const tryValidateServerInfo = (): boolean => {
        if (serverInfo.serverName.length === 0 || serverInfo.serverAddress.length === 0) {
            showError("Server name or address couldn't be empty.");
            return false;
        }
        return true;
    };

    return { busy, doAdd, doEdit, doDelete, doConnectionTest };
};
