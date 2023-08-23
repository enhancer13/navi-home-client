// noinspection JSIgnoredPromiseFromCall

import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {authenticationInfoStorage, ServerInfo, serverInfoStorage} from "../../../Features/DataStorage";
import {IconButton, Text, useTheme} from "react-native-paper";
import {useDataStorageEvents} from "../../../Features/DataStorage/Hooks/useDataStorageEvents";
import {DataStorageEventTypes} from "../../../Framework/Data/DataStorage";
import {Server, ServerStatus} from "./Server";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {useNavigation} from "@react-navigation/native";
import {RootNavigationProp} from "../../../RootStackNavigator";

declare type ServerManagerProps = {
    onServerChanged: (serverInfo: ServerInfo | null) => void;
    onServerStatusChanged: (serverStatus: ServerStatus | null) => void;
    style: StyleProp<ViewStyle> | undefined;
};

const chevronIconSize = Math.min(wp('10%'), 500);
const serverActionIconSize = Math.min(wp('10%'), 500);

export const ServerManager: React.FC<ServerManagerProps> = ({
                                                              onServerChanged,
                                                              onServerStatusChanged,
                                                              style
                                                          }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentServer, setCurrentServer] = useState<ServerInfo | null>(null);
    const [servers, setServers] = useState<ServerInfo[]>([]);
    const {subscribe} = useDataStorageEvents(serverInfoStorage);
    const theme = useTheme();
    const navigation = useNavigation<RootNavigationProp>();
    const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        async function initializeData() {
            const servers = await serverInfoStorage.getAll();
            setServers(servers);

            if (servers.length === 0) {
                setCurrentServer(null);
                onServerStatusChanged(null);
                return;
            }

            // read the last authenticated server
            const authenticationInfo = await authenticationInfoStorage.getLast();
            if (authenticationInfo) {
                const index = servers.findIndex(s => s.serverName === authenticationInfo.serverName);
                if (index !== -1) {
                    scrollToServerAtIndex(index);
                }
            } else {
                scrollToServerAtIndex(0);
            }
        }

        initializeData();
        subscribe([DataStorageEventTypes.DataChanged, DataStorageEventTypes.DataCreated, DataStorageEventTypes.DataDeleted], initializeData);
    }, []);

    useEffect(() => {
        onServerChanged && onServerChanged(currentServer);
    }, [currentServer, onServerChanged]);

    const handleSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        scrollToServerAtIndex(selectedIndex);
    };

    const scrollToServerAtIndex = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: windowWidth * index,
            animated: true,
        });
        setCurrentIndex(index);
        setCurrentServer(servers[index]);
    };

    const handleServerEdit = useCallback(() => {
        navigation.navigate('Server Config', {serverName: currentServer!.serverName});
    }, [navigation, currentServer]);

    const handleStatusChanged = useCallback((serverStatus: ServerStatus, serverInfo: ServerInfo) => {
        if (serverInfo.serverName !== currentServer?.serverName) {
            return;
        }

        onServerStatusChanged(serverStatus);
    }, [currentServer?.serverName, onServerStatusChanged]);

    const handleServerAdd = useCallback(() => navigation.navigate('Server Config' as never), [navigation]);

    return (
        <View style={[styles.container, style]}>
            {servers.length === 0 ?
                <Text variant={"titleLarge"}>Please configure &apos;Navi Home&apos; server</Text> :
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    ref={scrollViewRef}
                    onMomentumScrollEnd={handleSwipe}
                    style={{width: windowWidth}}
                >
                    {servers.map((serverInfo, index) => (
                        <Server key={serverInfo.serverName} serverInfo={serverInfo} width={windowWidth}
                                visible={index === currentIndex} onStatusChanged={handleStatusChanged}/>
                    ))}
                </ScrollView>
            }
            <View style={styles.rowContainer}>
                <IconButton onPress={handleServerAdd} icon={'playlist-plus'}
                            iconColor={theme.colors.onSurface} size={serverActionIconSize}/>
                <IconButton onPress={handleServerEdit} icon={'notebook-edit-outline'} disabled={!currentServer}
                            iconColor={theme.colors.onSurface} size={serverActionIconSize}/>
            </View>
            {currentIndex < servers.length - 1 && (
                <TouchableOpacity style={styles.rightChevron} onPress={() => scrollToServerAtIndex(currentIndex + 1)}>
                    <FontAwesome
                        name="chevron-right"
                        size={chevronIconSize}
                        color={theme.colors.onBackground}
                    />
                </TouchableOpacity>
            )}
            {currentIndex > 0 && (
                <TouchableOpacity style={[styles.leftChevron]} onPress={() => scrollToServerAtIndex(currentIndex - 1)}>
                    <FontAwesome
                        name="chevron-left"
                        size={chevronIconSize}
                        color={theme.colors.onBackground}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    leftChevron: {
        position: 'absolute',
        left: 0,
        top: '50%',
        marginTop: -chevronIconSize / 2,
        opacity: 0.1,
    },
    rightChevron: {
        position: 'absolute',
        right: 0,
        top: '50%',
        marginTop: -chevronIconSize / 2,
        opacity: 0.1,
    },
    rowContainer: {
        flexDirection: 'row'
    }
});
