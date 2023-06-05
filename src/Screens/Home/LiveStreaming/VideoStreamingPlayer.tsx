import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {backendEndpoints} from '../../../Config/BackendEndpoints';
import {httpClient} from '../../../Framework/Net/HttpClient/HttpClient';
import {ApplicationServices, IServicesStatus} from '../../../BackendTypes';
import {LoadingActivityIndicator} from '../../../Components/Controls';
import VideoPlayer from '../../../Features/VideoPlayer';
import {useAuth} from '../../../Features/Authentication';
import {useTheme, Text} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import color from "color";

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
                                                                       width
                                                                   }) => {
    const {authentication} = useAuth();
    const playerRef = useRef<VideoPlayer | null>(null);
    const theme = useTheme();
    const playerControlsHeight = (0.08 * width) / videoAspectRatio;
    const iconSize = playerControlsHeight * 0.9;
    const styles = createStyles(theme, playerControlsHeight, iconSize);

    const toggleAppService = async (service: ApplicationServices, currentState: boolean): Promise<void> => {
        const path = backendEndpoints.Services.APPLICATION_SERVICE_ACTION(service, streamingSource.id, currentState);
        await httpClient.put(path, {authentication});
    }

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
                name="ios-recording-outline"
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
                name="ios-power"
                color={framesProducerActive ? 'white' : '#2d2d67'}
                size={iconSize}
            />
        );
        return (
            <LinearGradient colors={[
                theme.colors.primary,
                color(theme.colors.primary).lighten(0.1).hex(),
                color(theme.colors.primary).lighten(0.3).hex()]} style={styles.player.controls}>
                <View style={styles.player.info}>
                    <Text style={styles.player.infoText} adjustsFontSizeToFit>
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

    const renderVideo = () => {
        const {
            servicesStatus: {
                framesStreamerReady,
                framesStreamerActive,
                framesProducerActive,
                framesProducerConnectionError
            },
            uri,
            thumbUri,
            headers,
        } = streamingSource;
        if (!framesProducerActive || framesProducerConnectionError || !framesStreamerActive || !framesStreamerReady) {
            return renderStatus();
        }
        return (
            <VideoPlayer
                ref={playerRef}
                uri={uri}
                thumbUri={thumbUri}
                headers={headers}
                nativeControls={false}
                muted={true}
                disableFocus={true}
                paused={true}
                style={{aspectRatio: videoAspectRatio}}
                disableSeekbar={true}
                showOnStart={true}
                disableTimer={true}
                disposeOnPause={true}
                alwaysShowBottomControls={true}
                tapAnywhereToPause={false}
                doubleTapTime={400}
            />
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
            {renderVideo()}
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
            },
            infoText: {
                color: theme.colors.onPrimary,
                fontSize: playerControlsHeight,
                textAlign: 'center',
                textAlignVertical: 'center',
            },
        }),
    }
};
