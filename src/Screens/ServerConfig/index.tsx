import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SafeAreaView from '../../Components/Layout/SafeAreaView';
import {ServerInfo, serverInfoStorage} from "../../Features/LocalStorage";
import {IconButton, TextInput, Text, useTheme} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import {useServerActions} from "./Hooks/useServerActions";
import color from "color";
import {LoadingActivityIndicator} from "../../Components/Controls";
import {AppHeader} from "../../Components/Layout";
import {useRoute} from "@react-navigation/native";
import {RootRouteProps} from "../../../App";
import {elevationShadowStyle} from "../../Helpers/StyleUtils";

const iconSize = hp(5);

export const ServerConfig: React.FC = () => {
    const [serverInfo, setServerInfo] = useState<ServerInfo>(new ServerInfo('', 'https://'));
    const {busy, doAdd, doEdit, doDelete, doConnectionTest} = useServerActions(serverInfo);
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const iconColor = theme.colors.primary;
    const route = useRoute<RootRouteProps<'Server Config'>>();

    useEffect(() => {
        async function initializeData() {
            if (route.params && route.params.serverName) {
                const {serverName} = route.params;
                const foundServerInfo = await serverInfoStorage.getBy((x) => x.serverName === serverName);
                if (!foundServerInfo) {
                    throw new Error(`Unable to find server with name: ${serverName}`);
                }

                setServerInfo(foundServerInfo);
            }
        }

        initializeData();
    }, []);

    return (
        <>
            <AppHeader title={'Server Configuration'} enableBackButton={true} />
            <SafeAreaView ignoreTopInsets={true} ignoreBottomInsets={false} style={styles.container}>
                <View style={styles.serverConfigContainer}>
                    <View style={styles.surface}>
                        <Text>{'Please enter the valid Navi Home server address.\n\nExample:\nhttps://127.0.0.1:9000\n'}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Server name"
                            value={serverInfo.serverName}
                            onChangeText={(value: string) =>
                                setServerInfo((prevState) => ({
                                    ...prevState,
                                    serverName: value
                                }))
                            }
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Server address"
                            value={serverInfo.serverAddress}
                            onChangeText={(value: string) =>
                                setServerInfo((prevState) => ({
                                    ...prevState,
                                    serverAddress: value
                                }))
                            }
                        />
                    </View>
                </View>
                <View style={styles.controlPanelContainer}>
                    <IconButton
                        icon="delete"
                        size={iconSize}
                        iconColor={iconColor}
                        onPress={doDelete}
                    />
                    {busy ? <LoadingActivityIndicator color={theme.colors.onPrimary}/> :
                        <IconButton icon={'access-point-check'} size={iconSize * 1.2} mode={'contained'}
                                    style={styles.connectionTestButton}
                                    iconColor={theme.colors.onPrimary} onPress={doConnectionTest}/>}
                    <IconButton
                        icon="content-save"
                        size={iconSize}
                        iconColor={iconColor}
                        onPress={() => {
                            serverInfo.key ? doEdit() : doAdd()
                        }}
                    />
                </View>
            </SafeAreaView>
        </>
    )
};

const createStyles = (theme: Theme) => {
    return StyleSheet.create({
        connectionTestButton: {
            backgroundColor: color(theme.colors.primary).lighten(0.2).hex(),
        },
        container: {
            justifyContent: 'space-between',
            flexGrow: 1,
        },
        serverConfigContainer: {
            width: '100%',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        controlPanelContainer: {
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            flexDirection: 'row',
            height: iconSize * 1.2,
            width: '100%',
            justifyContent: 'space-between',
            paddingLeft: hp(1),
            paddingRight: hp(1),
        },
        surface: {
            ...elevationShadowStyle(theme, 10),
            backgroundColor: theme.colors.surface,
            padding: 20,
            borderRadius: 10,
            width: '95%',
            flexGrow: 0.95,
            flex: 0.95,
        },
        textInput: {
            marginBottom: 10
        },
    });
};
