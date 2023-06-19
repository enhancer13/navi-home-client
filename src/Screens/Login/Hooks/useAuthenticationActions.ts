import {usePopupMessage} from "../../../Features/Messaging";
import {useEffect, useState} from "react";
import Keychain from "react-native-keychain";
import {useNavigation} from "@react-navigation/native";
import {applicationSettingsStorage} from "../../../Features/LocalStorage";
import {useAuth} from "../../../Features/Authentication";
import {DataStorageEventTypes} from "../../../Framework/Data/DataStorage";
import {useApplicationSettings} from "../../../Components/Hooks/DataStorage/useApplicationSettings";
import {useDataStorage} from "../../../Components/Hooks/DataStorage/useDataStorage";

export const useAuthenticationActions = () => {
    const {showError} = usePopupMessage();
    const {login} = useAuth();
    const [busy, setBusy] = useState<boolean>(false);
    const navigation = useNavigation();
    const [biometryActive, setBiometryActive] = useState<boolean>(false);
    const [biometryType, setBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
    const applicationSettings = useApplicationSettings();
    const {subscribe, unsubscribe} = useDataStorage(() => applicationSettingsStorage);

    const initializeBiometryData = async () => {
        console.debug('point 1');
        if (!applicationSettings) {
            return;
        }

        const biometryType = await Keychain.getSupportedBiometryType();
        console.debug('point 2');

        setBiometryType(biometryType);
        setBiometryActive(applicationSettings.biometryAuthenticationActive);
    };

    useEffect(() => {
        initializeBiometryData();

        subscribe(DataStorageEventTypes.DataCreated, initializeBiometryData);
        subscribe(DataStorageEventTypes.DataChanged, initializeBiometryData);
        return () => {
            unsubscribe(DataStorageEventTypes.DataCreated, initializeBiometryData);
            unsubscribe(DataStorageEventTypes.DataChanged, initializeBiometryData);
        }
    }, [applicationSettings]);

    const authenticate = async (serverName: string, username: string, password?: string) => {
        if (username.length === 0) {
            showError('Invalid username');
            return;
        }

        if (serverName.length === 0) {
            showError('Please configure the valid Navi Home server');
            return;
        }

        setBusy(true);
        try {
            await login(serverName, username, password);
            navigation.navigate('Home' as never);
        } catch (error: any) {
            console.error(error);
            showError(error.message);
        } finally {
            setBusy(false);
        }
    };

    const authenticateWithCredentials = async (serverName: string, username: string, password: string): Promise<void> => {
        if (password.length === 0) {
            showError('Invalid password');
            return;
        }
        await authenticate(serverName, username, password);
    };

    const authenticateWithBiometry = async (serverName: string, username: string) => await authenticate(serverName, username);

    return {
        biometryActive,
        biometryType,
        busy,
        authenticate,
        authenticateWithBiometry,
        authenticateWithCredentials,
        initializeBiometryData
    };
};
