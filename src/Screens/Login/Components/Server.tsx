import React, {useCallback, useMemo, useState} from "react";
import {ServerInfo} from "../../../Features/DataStorage";
import {Text} from "react-native-paper";
import FastImage from "react-native-fast-image";
import {StyleSheet, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {httpClient} from "../../../Framework/Net/HttpClient/HttpClient";
import {backendEndpoints} from "../../../Config/BackendEndpoints";
import {useFocusEffect} from "@react-navigation/native";
import {HttpRequestOptions} from "../../../Framework/Net/HttpClient/HttpRequestOptions";

declare type ServerProps = {
    serverInfo: ServerInfo;
    width: number;
    visible: boolean;
}

const CONNECTION_TEST_TIMEOUT = 1000;
const CONNECTION_TEST_INTERVAL = 10000;

const serverIconSize = Math.min(wp('30%'), 500);
export const Server: React.FC<ServerProps> = ({serverInfo, width, visible}) => {
    const [online, setOnline] = useState<boolean>(false);
    const abortController = useMemo(() => new AbortController(), []);

    useFocusEffect(useCallback(() => {
        if (!visible) {
            return;
        }

        async function doConnectionTest() {
            const httpRequestOptions: HttpRequestOptions = {signal: abortController.signal, timeout: CONNECTION_TEST_TIMEOUT};
            let isOnline = true;

            try {
                await httpClient.get(serverInfo.serverAddress + backendEndpoints.Identity.DISCOVERY, httpRequestOptions);
            } catch (e) {
                isOnline = false;
            }

            if (abortController.signal.aborted) {
                return;
            }
            setOnline(isOnline);
        }

        doConnectionTest();
        const intervalId = setInterval(() => {
            doConnectionTest();
        }, CONNECTION_TEST_INTERVAL);

        return () => {
            clearInterval(intervalId);
            abortController?.abort();
        };
    }, [abortController, serverInfo.serverAddress, visible]));

    const serverImage = useMemo(() => {
        return online ? require('../Resources/server_online.gif') : require('../Resources/server_offline.png');
    }, [online]);

    return (
        <View style={[styles.serverContainer, {width: width}]}>
            <Text variant={"headlineMedium"}>{serverInfo.serverName}</Text>
            <Text variant={"bodyMedium"}>{online ? "Online" : "Offline"}</Text>
            <FastImage source={serverImage} style={styles.serverIcon}/>
        </View>
    );
}

const styles = StyleSheet.create({
    serverContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    serverIcon: {
        width: serverIconSize,
        height: serverIconSize
    },
});
