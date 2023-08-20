import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {authenticationInfoStorage, ServerInfo} from "../../../Features/DataStorage";
import {useAuthenticationActions} from "../Hooks/useAuthenticationActions";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import Keychain from "react-native-keychain";
import {useTheme, Text, IconButton, Button} from "react-native-paper";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

interface UserAuthenticationProps {
    server: ServerInfo | null;
}

interface AuthenticationMessageContent {
    title: string;
    subtitle: string | null;
    body: string;
}

const biometryIconSize = Math.min(wp('40%'), 500);
const credentialsIconSize = biometryIconSize * 0.8;

export const UserAuthentication: React.FC<UserAuthenticationProps> = ({server}) => {
    const [messageContent, setMessageContent] = useState<AuthenticationMessageContent | null>(null);
    const [username, setUsername] = useState<string | undefined>();
    const {biometryActive, biometryType, initiateBiometryLogin, initiateCredentialsLogin} = useAuthenticationActions(server, username);
    const theme = useTheme();

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
        if (biometryActive && server && username) {
            setMessageContent({
                title: "Glad to see you,",
                subtitle: username,
                body: "please authenticate",
            });
        } else if (!biometryActive && server && username) {
            setMessageContent({
                title: "Welcome back,",
                subtitle: username,
                body: "Please authenticate with your credentials",
            });
        } else if (server && !username) {
            setMessageContent({
                title: "Hello there!",
                subtitle: null,
                body: "Let's get started. Please authenticate with your credentials",
            });
        } else if (!server) {
            setMessageContent({
                title: "Welcome to our app!",
                subtitle: null,
                body: "To get started, please configure a server and authenticate.",
            });
        }
    }, [biometryActive, server, username]);

    const handleBiometryAuthenticate = useCallback(async () => {
        await initiateBiometryLogin(server, username);
    }, [initiateBiometryLogin, server, username]);

    const handleCredentialsAuthenticate = useCallback(async () => {
        await initiateCredentialsLogin(server);
    }, [initiateCredentialsLogin, server]);

    const biometryIcon = useMemo(() => {
        if (!biometryActive || !biometryType) {
            return null;
        }

        const faceIdBiometry = biometryType === Keychain.BIOMETRY_TYPE.FACE || biometryType === Keychain.BIOMETRY_TYPE.FACE_ID;
        const icon = faceIdBiometry ? require('../Resources/face-id.png') : require('../Resources/finger-print.png');

        return (
            <TouchableOpacity onPress={handleBiometryAuthenticate}>
                <FastImage source={icon} style={styles.biometryIcon}/>
            </TouchableOpacity>);
    }, [handleBiometryAuthenticate, biometryType, biometryActive, theme]);

    return (
        <View style={styles.authenticateContainer}>
            <Text variant={"headlineMedium"}>{messageContent?.title}</Text>
            <Text variant={"headlineMedium"}>{messageContent?.subtitle}</Text>
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


