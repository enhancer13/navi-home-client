import React, {useCallback, useMemo} from 'react';
import {useTheme, Text, ActivityIndicator, MD3Theme} from 'react-native-paper';
import {useCalculateDimensions} from './Hooks/useCalculateDimensions';
import get from 'lodash/get';
import {IMediaStatus} from '../../IMediaStatus';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MediaViewer from '../MediaZoom/MediaZoom';
import {IMediaSource} from '../../IMediaSource';

export type MediaElementProps = {
    index: number;
    mediaSource: IMediaSource;
    containerWidth: number;
    containerHeight: number;
    mediaStatus: IMediaStatus;
    onLongPress?: (index: number) => void;
    onClick?: (index: number) => void;
    onDoubleClick?: (index: number) => void;
    onSwipeDown?: () => void;
    onResponderRelease: (vx: number) => void;
    onHorizontalOuterRangeOffset: (offsetX: number) => void;
    children: ((width: number, height: number) => React.ReactNode) | React.ReactNode;
};

const statusIconSize = hp(10);

export const MediaElement: React.FC<MediaElementProps> = ({
                                                              index,
                                                              mediaSource,
                                                              containerWidth,
                                                              containerHeight,
                                                              mediaStatus,
                                                              onLongPress,
                                                              onClick,
                                                              onDoubleClick,
                                                              onSwipeDown,
                                                              onResponderRelease,
                                                              onHorizontalOuterRangeOffset,
                                                              children,
                                                          }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(containerWidth, containerHeight), [containerWidth, containerHeight]);
    const {width, height} = useCalculateDimensions(
        get(mediaStatus, 'width'),
        get(mediaStatus, 'height'),
        containerWidth,
        containerHeight
    );

    const handleClick = useCallback(() => {
        onClick && onClick(index);
    }, [index, onClick]);

    const handleDoubleClick = useCallback(() => {
        onDoubleClick && onDoubleClick(index);
    }, [index, onDoubleClick]);

    const handleLongPress = useCallback(() => {
        onLongPress && onLongPress(index);
    }, [index, onLongPress]);

    const renderFail = (index: number, theme: MD3Theme) => (
        <View key={index} style={styles.mediaContainer}>
            <Text>{'Unable to load media'}</Text>
            <MaterialCommunityIcons name="alert-circle" size={statusIconSize} color={theme.colors.error}/>
        </View>
    );

    const renderLoading = (index: number, theme: MD3Theme) => (
        <View key={index} style={styles.mediaContainer}>
            <ActivityIndicator size={statusIconSize} color={theme.colors.primary}/>
        </View>
    );

    switch (mediaStatus.status) {
        case 'loading':
            return renderLoading(index, theme);
        case 'fail':
            return renderFail(index, theme);
        case 'success':
            return (
                <MediaViewer
                    key={index}
                    cropWidth={containerWidth}
                    cropHeight={containerHeight}
                    horizontalOuterRangeOffset={onHorizontalOuterRangeOffset}
                    responderRelease={onResponderRelease}
                    onLongPress={handleLongPress}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    imageWidth={width}
                    imageHeight={height}
                    enableSwipeDown={true}
                    onSwipeDown={onSwipeDown}
                    maxOverflow={containerWidth}
                    pinchToZoom={mediaSource.mediaType === 'IMAGE'}
                    enableDoubleClickZoom={mediaSource.mediaType === 'IMAGE'}
                    style={{backgroundColor: theme.colors.background}}
                >
                    {typeof children === 'function' ? children(width, height) : children}
                </MediaViewer>
            );
    }
};

const createStyles = (containerWidth: number, containerHeight: number) => StyleSheet.create({
    mediaContainer: {
        width: containerWidth,
        height: containerHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

