// noinspection JSIgnoredPromiseFromCall

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {authenticationInfoStorage, ServerInfo} from "../../../Features/DataStorage";
import {useAuthenticationActions} from "../Hooks/useAuthenticationActions";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import Keychain from "react-native-keychain";
import {Text, IconButton} from "react-native-paper";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {ServerStatus} from "./Server";
import {useApplicationSettings} from "../../../Features/DataStorage/Hooks/useApplicationSettings";

interface UserAuthenticationProps {
    serverInfo: ServerInfo | null;
    serverStatus: ServerStatus | null;
}

interface AuthenticationMessageContent {
    title: string;
    subtitle?: string;
    body: string;
}

const biometryIconSize = Math.min(wp('40%'), 500);
const credentialsIconSize = biometryIconSize * 0.8;

export const UserAuthentication: React.FC<UserAuthenticationProps> = ({
                                                                          serverInfo,
                                                                          serverStatus
}) => {
    const [messageContent, setMessageContent] = useState<AuthenticationMessageContent | null>(null);
    const [username, setUsername] = useState<string | undefined>();
    const [autoLoginExecuted, setAutoLoginExecuted] = useState<boolean>(false);
    const {biometryAuthCheckResult, initiateBiometryLogin, initiateCredentialsLogin} = useAuthenticationActions(serverInfo, username);
    const {applicationSettings} = useApplicationSettings();

    useEffect(() => {
        if (autoLoginExecuted || !username || !applicationSettings || !biometryAuthCheckResult) {
            return;
        }

        if (serverStatus === ServerStatus.Online && applicationSettings.autoLoginActive && biometryAuthCheckResult.isAvailable) {
            setAutoLoginExecuted(true);
            initiateBiometryLogin(serverInfo, username);
        }
    }, [serverInfo, username, serverStatus, applicationSettings, autoLoginExecuted, biometryAuthCheckResult, initiateBiometryLogin, initiateCredentialsLogin]);

    useEffect(() => {
        if (serverInfo) {
            authenticationInfoStorage.getLastForServer(serverInfo.serverName)
                .then(authenticationInfo => {
                    setUsername(authenticationInfo?.username);
                })
        } else {
            setUsername(undefined);
        }
    }, [serverInfo]);

    useEffect(() => {
        // Handling server issues first
        if (serverInfo && serverStatus === ServerStatus.Offline) {
            setMessageContent({
                title: "Connection Issue!",
                body: "There is no connection right now. Please try again later.",
            });
            return;
        }

        if (serverInfo && serverStatus === ServerStatus.Error) {
            setMessageContent({
                title: "Server Error!",
                body: "There seems to be an issue with the server. Please contact administrator.",
            });
            return;
        }

        // No message if biometryAuthCheckResult is absent
        if (!biometryAuthCheckResult) {
            return;
        }

        // Handling absence of configured servers
        if (!serverInfo) {
            setMessageContent({
                title: "Welcome to our app!",
                body: "To get started, please configure a server and authenticate.",
            });
            return;
        }

        // If there's a username and biometry is available
        if (username && biometryAuthCheckResult.isAvailable) {
            setMessageContent({
                title: `Glad to see you, ${username}`,
                body: "please authenticate",
            });
            return;
        }

        // If there's a username but biometry isn't available
        if (username) {
            setMessageContent({
                title: `Welcome back, ${username}`,
                subtitle: biometryAuthCheckResult.reason,
                body: "Please authenticate with your credentials",
            });
            return;
        }

        setMessageContent({
            title: "Hello there!",
            body: "Let's get started. Please authenticate with your credentials",
        });
    }, [biometryAuthCheckResult, serverInfo, serverStatus, username]);

    const handleBiometryAuthenticate = useCallback(async () => {
        await initiateBiometryLogin(serverInfo, username!);
    }, [initiateBiometryLogin, serverInfo, username]);

    const handleCredentialsAuthenticate = useCallback(async () => {
        await initiateCredentialsLogin(serverInfo);
    }, [initiateCredentialsLogin, serverInfo]);

    const authenticationActions = useMemo(() => {
        if (serverStatus === ServerStatus.Offline || !biometryAuthCheckResult) {
            return null;
        }

        const biometryType = biometryAuthCheckResult.biometryType;
        const isBiometryAuthAvailable = biometryAuthCheckResult.isAvailable;
        if (!biometryType || !isBiometryAuthAvailable) {
            return <IconButton icon="security" onPress={handleCredentialsAuthenticate} style={styles.authenticateButton} size={credentialsIconSize}/>;
        }

        const faceIdBiometry = biometryType === Keychain.BIOMETRY_TYPE.FACE || biometryType === Keychain.BIOMETRY_TYPE.FACE_ID;
        const icon = faceIdBiometry ? require('./Resources/face-id.png') : require('./Resources/finger-print.png');

        return (
            <>
                <TouchableOpacity onPress={handleBiometryAuthenticate}>
                    <FastImage source={icon} style={styles.biometryIcon}/>
                </TouchableOpacity>
                <IconButton icon="security" onPress={handleCredentialsAuthenticate} style={styles.authenticateButton} size={credentialsIconSize * 0.3}/>
            </>);
    }, [serverStatus, biometryAuthCheckResult, handleBiometryAuthenticate, handleCredentialsAuthenticate]);

    return (
        <View style={styles.container}>
            <Text variant={"headlineMedium"}>{messageContent?.title}</Text>
            <Text variant={"bodyMedium"}>{messageContent?.subtitle}</Text>
            <Text variant={"bodyMedium"}>{messageContent?.body}</Text>
            {authenticationActions}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: '20%',
    },
    biometryIcon: {
        width: biometryIconSize,
        height: biometryIconSize
    },
    serverPicker: {
        paddingBottom: '20%',
    },
    authenticateButton: {
        marginTop: '5%'
    }
});


