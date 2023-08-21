// noinspection JSIgnoredPromiseFromCall

import {usePopupMessage} from "../../../Features/Messaging";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../../Features/Authentication";
import {ServerInfo} from "../../../Features/DataStorage";
import {BiometricAuthCheckResult} from "../../../Features/Authentication/AuthServices/AuthenticationService";

export const useAuthenticationActions = (server: ServerInfo | null, username: string | undefined) => {
    const {showError} = usePopupMessage();
    const {initiateLoginWithCredentials, initiateLoginWithBiometrics, checkBiometricAuthenticationAvailability} = useAuth();
    const navigation = useNavigation();
    const [biometryAuthCheckResult, setBiometryAuthCheckResult] = useState<BiometricAuthCheckResult | null>(null);

    useEffect(() => {
        checkBiometricAuthenticationAvailability(server, username).then((biometryCheckResult: BiometricAuthCheckResult) => {
            setBiometryAuthCheckResult(biometryCheckResult);
        });
    }, [checkBiometricAuthenticationAvailability, server, username]);

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
        biometryAuthCheckResult,
        initiateCredentialsLogin,
        initiateBiometryLogin
    };
};
