import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image} from 'react-native';
import Video, {ReactVideoPoster, ReactVideoSource} from 'react-native-video';

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
    ({ posterUri, sourceUri, headers = {}, aspectRatio = 16 / 9, isLive = false }, ref) => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);
        const [videoKey, setVideoKey] = useState(0);
        const [paused, setPaused] = useState(!isLive);
        const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        useEffect(() => {
            setPaused(!isLive);
        }, [isLive]);

        useImperativeHandle(ref, () => ({
            play: () => setPaused(false),
            pause: () => setPaused(true),
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
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
                errorTimeoutRef.current = null;
            }
            setLoading(false);
            setError(false);
        }, []);

        const handleError = useCallback(() => {
            setLoading(false);
            errorTimeoutRef.current = setTimeout(() => {
                setError(true);
                setPaused(true);
            }, 300);
        }, []);

        const handleBuffer = useCallback((e: { isBuffering: boolean }) => {
            setLoading(e.isBuffering);
        }, []);

        const handleProgress = useCallback(() => {
            setLoading(false);
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
            <View style={[styles.container, { aspectRatio }]}>
                {!error && (
                    <Video
                        key={videoKey}
                        source={source}
                        poster={poster}
                        paused={paused}
                        controls={true}
                        playWhenInactive={false}
                        style={styles.player}
                        onLoadStart={handleLoadStart}
                        onBuffer={handleBuffer}
                        onLoad={handleLoad}
                        onError={handleError}
                        onProgress={handleProgress}
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
