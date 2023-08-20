import {usePopupMessage} from "../../../Features/Messaging";
import {useEffect, useState} from "react";
import Keychain from "react-native-keychain";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../../Features/Authentication";
import {useApplicationSettings} from "../../../Features/DataStorage/Hooks/useApplicationSettings";
import {ServerInfo} from "../../../Features/DataStorage";

export const useAuthenticationActions = (server: ServerInfo | null, username: string | undefined) => {
    const {showError} = usePopupMessage();
    const {initiateLoginWithCredentials, initiateLoginWithBiometrics, loginWithBiometricsAvailable} = useAuth();
    const navigation = useNavigation();
    const [biometryActive, setBiometryActive] = useState(false);
    const [biometryAuthPossible, setBiometryAuthPossible] = useState(false);
    const [biometryType, setBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);
    const {applicationSettings} = useApplicationSettings();

    useEffect(() => {
        if (server && username) {
            loginWithBiometricsAvailable(server, username).then(() => setBiometryAuthPossible(true));
            return;
        }

        setBiometryAuthPossible(false);
    }, [username, server, loginWithBiometricsAvailable]);

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

    const initiateLogin = async (serverInfo: ServerInfo | null, username?: string) => {
        if (!serverInfo) {
            showError('Please configure the valid Navi Home server');
            return;
        }

        try {
            username ?
                await initiateLoginWithBiometrics(serverInfo, username) :
                await initiateLoginWithCredentials(serverInfo);
            navigation.navigate('Home' as never);
        } catch (error: any) {
            showError(error.message);
        }
    };

    const initiateCredentialsLogin = async (server: ServerInfo | null): Promise<void> => {
        await initiateLogin(server);
    };

    const initiateBiometryLogin = async (server: ServerInfo | null, username: string) => {
        await initiateLogin(server, username);
    };

    return {
        biometryActive,
        biometryType,
        initiateCredentialsLogin,
        initiateBiometryLogin
    };
};
