import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {httpClient} from '../../../Framework/Net/HttpClient/HttpClient';
import {ApplicationServices, IServicesStatus} from '../../../BackendTypes';
import {LoadingActivityIndicator} from '../../../Components/Controls';
import {useAuth} from '../../../Features/Authentication';
import {useTheme, Text} from 'react-native-paper';
import {MD3Theme as Theme} from 'react-native-paper';
import color from 'color';
import {PlaybackState, VideoPlayer} from '../../../Features/VideoPlayer';
import FastImage from 'react-native-fast-image';

const videoAspectRatio = 16 / 9;

export interface IStreamingSource {
    id: number;
    name: string;
    uri: string;
    thumbUri: string;
    servicesStatus: IServicesStatus;
    headers: { [key: string]: string } | undefined;
}

interface VideoStreamingPlayerProps {
    streamingSource: IStreamingSource;
    width: number;
}

const VideoStreamingPlayer: React.FC<VideoStreamingPlayerProps> = ({
                                                                       streamingSource,
                                                                       width,
                                                                   }) => {
    const [paused, setPaused] = useState(true);
    const {authentication} = useAuth();
    const theme = useTheme();
    const playerControlsHeight = (0.08 * width) / videoAspectRatio;
    const iconSize = playerControlsHeight * 0.9;
    const styles = createStyles(theme, playerControlsHeight, iconSize);

    const toggleAppService = async (service: ApplicationServices, currentState: boolean): Promise<void> => {
        const path = backendEndpoints.Services.APPLICATION_SERVICE_ACTION(service, streamingSource.id, currentState);
        await httpClient.put(path, {authentication});
    };

    const handlePlaybackStateChange = useCallback(
        (state: PlaybackState) => {
            setPaused(state === 'paused');
        },
        [],
    );

    const renderControl = (children: React.ReactNode, callback?: () => Promise<void>) => {
        return (
            <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => {
                    callback && callback();
                }}
                style={[styles.player.control]}>
                {children}
            </TouchableOpacity>
        );
    };

    const renderBottomControls = () => {
        const {
            framesProducerActive,
            videoRecorderActive,
            motionDetectorActive,
            framesProducerConnectionError,
        } = streamingSource.servicesStatus;
        const motionDetectorControl = (
            <MaterialCommunityIcons
                name={motionDetectorActive ? 'motion-sensor' : 'motion-sensor-off'}
                color={motionDetectorActive ? 'white' : '#2d2d67'}
                size={iconSize}
            />
        );
        const videoRecordingControl = (
            <Ionicons
                name="recording-outline"
                color={videoRecorderActive ? 'white' : '#2d2d67'}
                size={iconSize}
            />
        );
        const cameraConnectionStatus = (
            <AntDesign
                name="disconnect"
                color={framesProducerConnectionError ? '#b81ac5' : '#2d2d67'}
                size={iconSize}
            />
        );
        const cameraControl = (
            <Ionicons
                name="power"
                color={framesProducerActive ? 'white' : '#2d2d67'}
                size={iconSize}
            />
        );
        return (
            <LinearGradient colors={[
                theme.colors.primary,
                color(theme.colors.primary).lighten(0.1).hex(),
                color(theme.colors.primary).lighten(0.2).hex()]} style={styles.player.controls}>
                <View style={styles.player.info}>
                    <Text style={styles.player.infoText} numberOfLines={1} ellipsizeMode="tail">
                        {streamingSource.name}
                    </Text>
                </View>
                <View style={styles.player.controlsGroup}>
                    {renderControl(motionDetectorControl, () =>
                        toggleAppService(ApplicationServices.MOTION_DETECTOR, motionDetectorActive),
                    )}
                    {renderControl(cameraConnectionStatus)}
                    {renderControl(videoRecordingControl, () =>
                        toggleAppService(ApplicationServices.VIDEO_RECORDER, videoRecorderActive),
                    )}
                    {renderControl(cameraControl, () =>
                        toggleAppService(ApplicationServices.PRODUCER, framesProducerActive),
                    )}
                </View>
            </LinearGradient>
        );
    };

    const renderPosterOverlay = () => (
        <TouchableOpacity
            style={styles.player.posterContainer}
            onPress={() => setPaused(false)}
            activeOpacity={0.8}>
            <FastImage
                source={{
                    uri: streamingSource.thumbUri,
                    headers: streamingSource.headers,
                }}
                style={styles.player.posterImage}
            />
            <Ionicons
                name="play-circle"
                size={64}
                color="rgba(255,255,255,0.9)"
                style={styles.player.playIcon}
            />
        </TouchableOpacity>
    );

    const renderVideoContent = () => {
        const {
            uri,
            thumbUri,
            headers,
            servicesStatus: {
                framesStreamerReady,
                framesStreamerActive,
                framesProducerActive,
                framesProducerConnectionError,
            },
        } = streamingSource;

        if (
            !framesProducerActive ||
            framesProducerConnectionError ||
            !framesStreamerActive ||
            !framesStreamerReady
        ) {
            return renderStatus();
        }

        return (
            <>
                {paused ? (
                    renderPosterOverlay()
                ) : (
                    <VideoPlayer
                        sourceUri={uri}
                        posterUri={thumbUri}
                        headers={headers}
                        aspectRatio={videoAspectRatio}
                        onPlaybackStateChange={handlePlaybackStateChange}
                    />
                )}
            </>
        );
    };

    const renderStatus = () => {
        const {
            framesStreamerReady,
            framesStreamerActive,
            framesProducerActive,
            framesProducerConnectionError,
        } = streamingSource.servicesStatus;
        if (framesStreamerActive && !framesStreamerReady) {
            return (
                <View style={styles.status.container}>
                    <Text style={styles.status.text}>Starting streaming service...</Text>
                    <LoadingActivityIndicator/>
                </View>
            );
        }
        let statusMessage;
        if (!framesStreamerActive && framesProducerActive && !framesProducerConnectionError) {
            statusMessage = 'Camera streaming service not active';
        }
        if (framesProducerConnectionError) {
            statusMessage = 'An error occurred while trying to connect to camera';
        }
        if (!framesProducerActive) {
            statusMessage = 'Camera service not active';
        }
        return statusMessage ? (
            <View style={styles.status.container}>
                <Text style={styles.status.text}>{statusMessage}</Text>
            </View>
        ) : null;
    };

    return (
        <View style={styles.player.container}>
            {renderVideoContent()}
            {renderBottomControls()}
        </View>
    );
};

export default VideoStreamingPlayer;

const createStyles = (theme: Theme, playerControlsHeight: number, iconSize: number) => {
    return {
        status: StyleSheet.create({
            container: {
                alignItems: 'center',
                aspectRatio: videoAspectRatio,
                backgroundColor: 'black',
                justifyContent: 'center',
                width: '100%',
                zIndex: 1,
            },
            text: {
                color: 'white',
            },
        }),
        player: StyleSheet.create({
            container: {
                margin: 5,
                borderRadius: 8,
                overflow: 'hidden',
            },
            posterContainer: {
                aspectRatio: videoAspectRatio,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                position: 'relative',
            },
            posterImage: {
                ...StyleSheet.absoluteFillObject,
                resizeMode: 'cover',
            },
            playIcon: {
                zIndex: 1,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            control: {
                marginRight: iconSize * 0.6,
            },
            controls: {
                alignItems: 'center',
                flexDirection: 'row',
                height: playerControlsHeight,
                justifyContent: 'flex-end',
            },
            controlsGroup: {
                alignItems: 'center',
                flex: 0.33,
                flexDirection: 'row',
                justifyContent: 'flex-end',
            },
            info: {
                flex: 0.33,
                height: playerControlsHeight,
            },
            infoText: {
                color: theme.colors.onPrimary,
                textAlign: 'center',
                textAlignVertical: 'center',
            },
        }),
    };
};
