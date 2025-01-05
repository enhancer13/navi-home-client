import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, FlatList, I18nManager, ListRenderItem, StyleSheet, View} from 'react-native';
import {ImageElement} from './ImageElement';
import {useLoadMedia} from './Hooks/useLoadMedia';
import {useCarouselControls} from './Hooks/useCarouselControls';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ThumbnailItem} from './ThumbnailItem';
import {VideoElement} from './VideoElement';
import {MD3Theme as Theme, useTheme} from 'react-native-paper';
import {IMediaSource} from '../../IMediaSource';
import {IMediaCarouselProps} from './IMediaCarouselProps';

const DEFAULT_SLIDE_ANIMATION_DURATION = 300;
const thumbnailSize = wp(10);

export const MediaCarousel: React.FC<IMediaCarouselProps> = ({
                                                                 mediaSources,
                                                                 containerWidth,
                                                                 containerHeight,
                                                                 initialIndex,
                                                                 onLongPress,
                                                                 onSwipeDown,
                                                                 onClick,
                                                                 onDoubleClick,
                                                                 useNativeDriver,
                                                                 slideAnimationTime = DEFAULT_SLIDE_ANIMATION_DURATION,
                                                                 thumbnailsContainerStyle,
                                                                 onCurrentMediaIndexChange,
                                                             }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme, containerWidth, containerHeight), [theme, containerWidth, containerHeight]);
    const {initialized, mediaStatuses, loadMedia} = useLoadMedia(mediaSources);
    const {
        currentMediaIndex,
        standardPositionXRef,
        positionXNumberRef,
        positionXAnimationRef,
        resetPosition,
        goBack,
        goNext,
        goToIndex,
    } = useCarouselControls(mediaSources, containerWidth, useNativeDriver, slideAnimationTime);
    const thumbnailsFlatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (initialized) {
            const index = currentMediaIndex > 0 ? currentMediaIndex : initialIndex;
            loadMedia(index);
            goToIndex(index, 0);
            onCurrentMediaIndexChange && onCurrentMediaIndexChange(currentMediaIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized]);

    useEffect(() => {
        loadMedia(currentMediaIndex);
        thumbnailsFlatListRef.current?.scrollToIndex({
            animated: true,
            index: currentMediaIndex,
            viewPosition: 0.5,
        });
        onCurrentMediaIndexChange && onCurrentMediaIndexChange(currentMediaIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMediaIndex]);

    const onHorizontalOuterRangeOffset = (offsetX = 0) => {
        positionXNumberRef.current = standardPositionXRef.current + offsetX;
        positionXAnimationRef.current.setValue(positionXNumberRef.current);

        const offsetXRTL = !I18nManager.isRTL ? offsetX : -offsetX;
        if (offsetXRTL < 0 && currentMediaIndex < mediaSources.length - 1) {
            loadMedia(currentMediaIndex + 1);
        } else if (offsetXRTL > 0 && currentMediaIndex > 0) {
            loadMedia(currentMediaIndex - 1);
        }
    };

    const onResponderRelease = (vx = 0) => {
        const vxRTL = I18nManager.isRTL ? -vx : vx;
        const directionMultiplier = I18nManager.isRTL ? -1 : 1;
        const deltaPosition = directionMultiplier * (positionXNumberRef.current - standardPositionXRef.current);

        const loadNewMedia = (newIndex: number) => {
            if (newIndex >= 0 && newIndex < mediaSources.length) {
                loadMedia(newIndex);
            }
        };
        const flipThreshold = 0.5 * containerWidth;
        const deltaPositionSign =  Math.sign(deltaPosition);
        const moveForward = vxRTL < -0.7 || (deltaPositionSign < 0 && Math.abs(deltaPosition) > flipThreshold);
        const moveBackward = vxRTL > 0.7 || (deltaPositionSign > 0 && Math.abs(deltaPosition) > flipThreshold);

        if (moveForward) {
            goNext();
            loadNewMedia((currentMediaIndex || 0) + 1);
            return;
        }

        if (moveBackward) {
            goBack();
            loadNewMedia((currentMediaIndex || 0) - 1);
            return;
        }
        resetPosition();
    };

    const onThumbnailClick = (index: number) => {
        loadMedia(index);
        goToIndex(index);
    };

    const renderThumbnail: ListRenderItem<IMediaSource> = ({item, index}) => {
        const isSelected = index === currentMediaIndex;
        return (
            <ThumbnailItem
                item={item}
                index={index}
                size={thumbnailSize}
                isSelected={isSelected}
                onPress={onThumbnailClick}
            />
        );
    };

    if (mediaStatuses.length === 0) {
        return null;
    }

    return (
        <>
            <Animated.View
                style={[styles.carouselContainer, {
                    transform: [{translateX: positionXAnimationRef.current}],
                    width: containerWidth * mediaSources.length,
                }]}>
                {mediaSources.map((mediaSource, index) => {
                    if (Math.abs(index - currentMediaIndex) > 1) {
                        return (
                            <View key={index} style={styles.mediaContainer}/>
                        );
                    }
                    const mediaStatus = mediaStatuses[index];
                    const commonProps = {
                        index,
                        currentMediaIndex,
                        mediaSource,
                        containerWidth,
                        containerHeight,
                        mediaStatus,
                        onLongPress,
                        onClick,
                        onDoubleClick,
                        onResponderRelease,
                        onHorizontalOuterRangeOffset,
                        onSwipeDown,
                    };
                    switch (mediaSource.mediaType) {
                        case 'IMAGE':
                            return <ImageElement key={index} {...commonProps} />;
                        case 'VIDEO':
                            return <VideoElement key={index} {...commonProps} />;
                        default:
                            throw new Error(`Unknown media type: ${mediaSource.mediaType}`);
                    }
                })}
            </Animated.View>
            <FlatList
                horizontal={true}
                ref={thumbnailsFlatListRef}
                data={mediaSources}
                style={[styles.thumbnailsFlatList, thumbnailsContainerStyle]}
                renderItem={renderThumbnail}
                keyExtractor={(item: IMediaSource, index: number) => index.toString()}
                initialScrollIndex={currentMediaIndex}
                getItemLayout={(data, index) => {
                    return {length: thumbnailSize, offset: thumbnailSize * index, index};
                }}
                removeClippedSubviews={true}
            />
        </>
    );
};

const createStyles = (theme: Theme, containerWidth: number, containerHeight: number) => StyleSheet.create({
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mediaContainer: {
        width: containerWidth,
        height: containerHeight,
    },
    thumbnailsFlatList: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
});

