import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ServerInfo} from "../../../Features/DataStorage";
import {Text} from "react-native-paper";
import FastImage from "react-native-fast-image";
import {StyleSheet, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {backendEndpoints} from "../../../Config/BackendEndpoints";
import {useFocusEffect} from "@react-navigation/native";
import {HttpRequestOptions} from "../../../Framework/Net/HttpClient/HttpRequestOptions";
import {httpClient} from "../../../Framework/Net/HttpClient/HttpClient";
import {IOpenIdConfiguration} from "../../../BackendTypes";

declare type ServerProps = {
    serverInfo: ServerInfo;
    width: number;
    visible: boolean;
    onStatusChanged: (status: ServerStatus, serverInfo: ServerInfo) => void;
}

export enum ServerStatus {
    Online = "Online",
    Offline = "Offline",
    Error = "Error"
}

const CONNECTION_TEST_TIMEOUT = 3000;
const CONNECTION_TEST_INTERVAL = 10000;
const serverIconSize = Math.min(wp('30%'), 500);

export const Server: React.FC<ServerProps> = ({
                                                  serverInfo,
                                                  width,
                                                  visible,
                                                  onStatusChanged
}) => {
    const [status, setStatus] = useState<ServerStatus>(ServerStatus.Offline);

    useFocusEffect(useCallback(() => {
        if (!visible) {
            return;
        }

        const abortController = new AbortController();
        async function doConnectionTest() {
            const httpRequestOptions: HttpRequestOptions = {signal: abortController.signal, timeout: CONNECTION_TEST_TIMEOUT};
            let status = ServerStatus.Online;
            try {
                console.debug('Testing connection to ' + serverInfo.serverAddress);
                const openIdConfiguration = await httpClient.get<IOpenIdConfiguration>(serverInfo.serverAddress + backendEndpoints.Identity.DISCOVERY, httpRequestOptions);
                if (!openIdConfiguration.issuer) {
                    status = ServerStatus.Error;
                }
            } catch (e: any) {
                if (e.message.includes("timeout")) {
                    status = ServerStatus.Offline;
                } else {
                    status = ServerStatus.Error;
                }
            }

            if (abortController.signal.aborted) {
                return;
            }
            setStatus(status);
        }

        doConnectionTest();
        const intervalId = setInterval(() => {
            doConnectionTest();
        }, CONNECTION_TEST_INTERVAL);

        return () => {
            clearInterval(intervalId);
            abortController?.abort();
        };
    }, [serverInfo.serverAddress, visible]));

    useEffect(() => {
        onStatusChanged(status, serverInfo);
    }, [status, onStatusChanged, serverInfo]);

    const serverImage = useMemo(() => {
        switch (status) {
            case ServerStatus.Online:
                return require('./Resources/server_online.gif');
            case ServerStatus.Offline:
                return require('./Resources/server_offline.png');
            case ServerStatus.Error:
                return require('./Resources/server_offline.png');
            default:
                throw new Error(`Unknown server status ${status}`);
        }
    }, [status]);

    return (
        <View style={[styles.serverContainer, {width: width}]}>
            <Text variant={"headlineMedium"}>{serverInfo.serverName}</Text>
            <Text variant={"bodyMedium"}>{status}</Text>
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
