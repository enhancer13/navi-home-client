import {usePopupMessage} from "../../../Features/Messaging";
import {useEffect, useState} from "react";
import Keychain from "react-native-keychain";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../../Features/Authentication";
import {useApplicationSettings} from "../../../Features/DataStorage/Hooks/useApplicationSettings";

export const useAuthenticationActions = () => {
    const {showError} = usePopupMessage();
    const {login} = useAuth();
    const [busy, setBusy] = useState<boolean>(false);
    const navigation = useNavigation();
    const [biometryActive, setBiometryActive] = useState<boolean>(false);
    const [biometryType, setBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
    const {applicationSettings} = useApplicationSettings();

    useEffect(() => {
        async function initializeBiometryData() {
            if (!applicationSettings) {
                return;
            }

            const biometryType = await Keychain.getSupportedBiometryType();
            setBiometryType(biometryType);
            setBiometryActive(applicationSettings.biometryAuthenticationActive);
        }

        initializeBiometryData();
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
        authenticateWithCredentials
    };
};
