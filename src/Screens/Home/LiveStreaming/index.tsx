import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItem, RefreshControl, View} from 'react-native';
import VideoStreamingPlayer, {IStreamingSource} from './VideoStreamingPlayer';
import {EventRegister} from 'react-native-event-listeners';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {useAuth} from '../../../Features/Authentication';
import {httpClient} from '../../../Framework/Net/HttpClient/HttpClient';
import {IServicesStatusContainer, IApplicationStatus} from '../../../BackendTypes';
import SafeAreaView from "../../../Components/Layout/SafeAreaView";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {getDeviceTypeSync, isTablet} from "react-native-device-info";
import {useLoadingDelay} from "../../../Components/Hooks/useLoadingDelay";
import {ModalLoadingActivityIndicator} from "../../../Components/Controls";

const columnCount = (isTablet() || getDeviceTypeSync() === 'Desktop') ? 2 : 1;

export const LiveStreamingScreen = () => {
    const {authentication} = useAuth();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [streamingSources, setStreamingSources] = useState<IStreamingSource[]>([]);
    const loading = useLoadingDelay(refreshing);

    const fetchStreamingSources = async (): Promise<IServicesStatusContainer[] | undefined> => {
        if (authentication === null) {
            throw new Error('Unable to fetch streaming sources, cause authentication doesnt exist');
        }
        try {
            setRefreshing(true);
            const applicationStatus = await httpClient.get<IApplicationStatus>(backendEndpoints.Services.APPLICATION_SERVICES_STATUS, {authentication});
            return applicationStatus.serviceStatusContainers;
        } catch (ex) {
            console.error('Unable to fetch video sources', ex);
        } finally {
            setRefreshing(false);
        }
    };

    const createStreamingPlayers = (serviceStatusContainers: IServicesStatusContainer[]) => {
        if (authentication === null) {
            throw new Error('Unable to create streaming players, cause authentication doesnt exist');
        }

        const streamingSources: IStreamingSource[] = [];
        serviceStatusContainers.forEach(serviceStatusContainer => {
            const videoSourceId = serviceStatusContainer.videoSource.id;
            streamingSources.push({
                id: videoSourceId,
                name: serviceStatusContainer.videoSource.cameraName,
                servicesStatus: serviceStatusContainer.servicesStatus,
                thumbUri: authentication.serverAddress + backendEndpoints.Streaming.THUMBNAIL(videoSourceId),
                uri: authentication.serverAddress + backendEndpoints.Streaming.HLS_PLAYLIST(videoSourceId),
                headers: authentication.authorizationHeader,
            });
        });
        setStreamingSources(streamingSources);
    };

    const initializeStreamingPlayers = async () => {
        const serviceStatusContainers = await fetchStreamingSources();
        if (serviceStatusContainers) {
            createStreamingPlayers(serviceStatusContainers);
        }
    };

    useEffect(() => {
        initializeStreamingPlayers();
        const firebaseMessageListener = EventRegister.addEventListener(
            'applicationStatus',
            ({serviceStatusContainers}: IApplicationStatus) =>
                createStreamingPlayers(serviceStatusContainers),
        );

        return () => {
            if (typeof firebaseMessageListener === 'string') {
                EventRegister.removeEventListener(firebaseMessageListener);
            }
        };
    }, []);

    const renderVideoPlayer: ListRenderItem<IStreamingSource> = ({item}) => {
        const columnWidth = wp(Math.floor(100 / columnCount));

        return (
            <View style={{width: columnWidth}}>
                <VideoStreamingPlayer width={columnWidth} streamingSource={item}/>
            </View>
        );
    };

    return (
        <SafeAreaView>
            <ModalLoadingActivityIndicator visible={loading} />
            <FlatList
                data={streamingSources}
                renderItem={renderVideoPlayer}
                keyExtractor={item => item.id.toString()}
                numColumns={columnCount}
                refreshing={refreshing}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={initializeStreamingPlayers}/>
                }
            />
        </SafeAreaView>
    );
};
