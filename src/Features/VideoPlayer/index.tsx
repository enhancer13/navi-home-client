import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image} from 'react-native';
import Video, {VideoRef, BufferConfig, ReactVideoPoster, ReactVideoSource} from 'react-native-video';

export interface VideoPlayerRef {
    play: () => void;
    pause: () => void;
}

interface VideoPlayerProps {
    posterUri?: string;
    sourceUri: string;
    headers?: { [key: string]: string };
    aspectRatio?: number;
    isLive?: boolean;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
    ({posterUri, sourceUri, headers = {}, aspectRatio = 16 / 9, isLive = false}, ref) => {
        const videoRef = useRef<VideoRef>(null);

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);
        const [videoKey, setVideoKey] = useState(0);

        useImperativeHandle(ref, () => ({
            play: () => videoRef.current?.resume(),
            pause: () => videoRef.current?.pause(),
        }));

        const handleRetry = useCallback(() => {
            setError(false);
            setLoading(true);
            setVideoKey(x => x + 1);
        }, []);

        const handleLoadStart = useCallback(() => {
            setLoading(true);
        }, []);

        const handleLoad = useCallback(() => {
            setLoading(false);
            setError(false);
        }, []);

        const handleError = useCallback(() => {
            setLoading(false);
            setError(true);
        }, []);

        const handleBuffer = useCallback((e: { isBuffering: boolean }) => {
            setLoading(e.isBuffering);
        }, []);

        const bufferConfig: BufferConfig = {
            live: { targetOffsetMs: 2000 },
        };

        const poster: ReactVideoPoster = {
            source: posterUri
                ? { uri: encodeURI(posterUri), headers }
                : undefined,
        };

        const source: ReactVideoSource = {
            uri: encodeURI(sourceUri),
            headers,
            bufferConfig,
        };

        return (
            <View style={[styles.container, { aspectRatio }]}>
                {!error && (
                    <Video
                        key={videoKey}
                        ref={videoRef}
                        source={source}
                        poster={poster}
                        controls
                        paused={!isLive}
                        playWhenInactive={false}
                        style={styles.player}
                        onLoadStart={handleLoadStart}
                        onBuffer={handleBuffer}
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                )}

                {loading && !error && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}

                {error && (
                    <View style={styles.overlay}>
                        {posterUri ? (
                            <Image
                                style={styles.posterFallback}
                                source={{ uri: posterUri }}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.blankFallback} />
                        )}
                        <Text style={styles.overlayText}>Failed to load video.</Text>
                        <TouchableOpacity onPress={handleRetry}>
                            <Text style={styles.overlayText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
    },
    player: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#fff',
        marginTop: 8,
    },
    posterFallback: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    blankFallback: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'absolute',
    },
});
