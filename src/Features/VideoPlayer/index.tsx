import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    useCallback,
    useRef,
} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image} from 'react-native';
import Video, {ReactVideoPoster, ReactVideoSource, OnPlaybackStateChangedData} from 'react-native-video';

export interface VideoPlayerRef {
    play: () => void;
    pause: () => void;
}

export type PlaybackState = 'playing' | 'paused';

interface VideoPlayerProps {
    posterUri?: string;
    sourceUri: string;
    headers?: { [key: string]: string };
    aspectRatio?: number;
    onPlaybackStateChange?: (state: PlaybackState) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
    (
        {
            posterUri,
            sourceUri,
            headers = {},
            aspectRatio = 16 / 9,
            onPlaybackStateChange,
        },
        ref,
    ) => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);
        const [videoKey, setVideoKey] = useState(0);
        const [paused, setPaused] = useState(false);
        const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        useImperativeHandle(ref, () => ({
            play: () => setPaused(false),
            pause: () => setPaused(true),
        }));

        const handlePlaybackStateChange = useCallback((isPlaying: boolean) => {
            if (isPlaying) {
                setLoading(false);
                setError(false);
                errorTimeoutRef.current && clearTimeout(errorTimeoutRef.current);
            }

            onPlaybackStateChange?.(isPlaying ? 'playing' : 'paused');
        }, [onPlaybackStateChange]);

        const handleRetry = useCallback(() => {
            setError(false);
            setLoading(true);
            setVideoKey(prev => prev + 1);
        }, []);

        const handleLoadStart = useCallback(() => {
            setLoading(true);
        }, []);

        const handleLoad = useCallback(() => {
            errorTimeoutRef.current && clearTimeout(errorTimeoutRef.current);
            setLoading(false);
            setError(false);
        }, []);

        const handleError = useCallback(() => {
            setLoading(false);
            errorTimeoutRef.current = setTimeout(() => {
                setError(true);
                onPlaybackStateChange?.('paused');
            }, 3000);
        }, [onPlaybackStateChange]);

        const handleBuffer = useCallback(({isBuffering}: {isBuffering: boolean}) => {
            setLoading(isBuffering);
        }, []);

        const poster: ReactVideoPoster = {
            source: posterUri
                ? { uri: posterUri, headers }
                : undefined,
        };

        const source: ReactVideoSource = {
            uri: sourceUri,
            headers,
        };

        return (
            <View style={[styles.container, {aspectRatio}]}>
                <Video
                    key={videoKey}
                    source={source}
                    poster={poster}
                    paused={paused}
                    controls={true}
                    style={styles.player}
                    onLoadStart={handleLoadStart}
                    onBuffer={handleBuffer}
                    onLoad={handleLoad}
                    onError={handleError}
                    onPlaybackStateChanged={(event: OnPlaybackStateChangedData) =>
                        handlePlaybackStateChange(event.isPlaying)
                    }
                />

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
