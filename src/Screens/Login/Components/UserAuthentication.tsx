import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {authenticationInfoStorage, ServerInfo} from "../../../Features/DataStorage";
import {useAuthenticationActions} from "../Hooks/useAuthenticationActions";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import Keychain from "react-native-keychain";
import {Text, IconButton} from "react-native-paper";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

interface UserAuthenticationProps {
    server: ServerInfo | null;
}

interface AuthenticationMessageContent {
    title: string;
    subtitle?: string;
    body: string;
}

const biometryIconSize = Math.min(wp('40%'), 500);
const credentialsIconSize = biometryIconSize * 0.8;

export const UserAuthentication: React.FC<UserAuthenticationProps> = ({server}) => {
    const [messageContent, setMessageContent] = useState<AuthenticationMessageContent | null>(null);
    const [username, setUsername] = useState<string | undefined>();
    const {biometryAuthCheckResult, initiateBiometryLogin, initiateCredentialsLogin} = useAuthenticationActions(server, username);

    useEffect(() => {
        if (server) {
            authenticationInfoStorage.getLastForServer(server.serverName)
                .then(authenticationInfo => {
                    setUsername(authenticationInfo?.username);
                })
        } else {
            setUsername(undefined);
        }
    }, [server]);

    useEffect(() => {
        if (!biometryAuthCheckResult) {
            return;
        }

        if (biometryAuthCheckResult.isAvailable && server && username) {
            setMessageContent({
                title: `Glad to see you, ${username}`,
                body: "please authenticate",
            });
        } else if (!biometryAuthCheckResult.isAvailable && server && username) {
            setMessageContent({
                title: `Welcome back, ${username}`,
                subtitle: biometryAuthCheckResult.reason,
                body: "Please authenticate with your credentials",
            });
        } else if (server && !username) {
            setMessageContent({
                title: "Hello there!",
                body: "Let's get started. Please authenticate with your credentials",
            });
        } else if (!server) {
            setMessageContent({
                title: "Welcome to our app!",
                body: "To get started, please configure a server and authenticate.",
            });
        }
    }, [biometryAuthCheckResult, server, username]);

    const handleBiometryAuthenticate = useCallback(async () => {
        await initiateBiometryLogin(server, username!);
    }, [initiateBiometryLogin, server, username]);

    const handleCredentialsAuthenticate = useCallback(async () => {
        await initiateCredentialsLogin(server);
    }, [initiateCredentialsLogin, server]);

    const biometryIcon = useMemo(() => {
        const biometryType = biometryAuthCheckResult?.biometryType;
        const isAvailable = biometryAuthCheckResult?.isAvailable;
        if (!biometryType || !isAvailable) {
            return null;
        }

        const faceIdBiometry = biometryType === Keychain.BIOMETRY_TYPE.FACE || biometryType === Keychain.BIOMETRY_TYPE.FACE_ID;
        const icon = faceIdBiometry ? require('../Resources/face-id.png') : require('../Resources/finger-print.png');

        return (
            <TouchableOpacity onPress={handleBiometryAuthenticate}>
                <FastImage source={icon} style={styles.biometryIcon}/>
            </TouchableOpacity>);
    }, [handleBiometryAuthenticate, biometryAuthCheckResult]);

    return (
        <View style={styles.authenticateContainer}>
            <Text variant={"headlineMedium"}>{messageContent?.title}</Text>
            <Text variant={"bodyMedium"}>{messageContent?.subtitle}</Text>
            <Text variant={"bodyMedium"}>{messageContent?.body}</Text>
            {biometryIcon}
            <IconButton icon="security" onPress={handleCredentialsAuthenticate}
                        style={styles.authenticateButton} size={biometryIcon ? credentialsIconSize * 0.3 : credentialsIconSize}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    authenticateContainer: {
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


