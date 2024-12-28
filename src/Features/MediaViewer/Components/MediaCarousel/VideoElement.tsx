import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from '../../../VideoPlayer';
import {MediaElement} from './MediaElement';
import {IMediaStatus} from '../../IMediaStatus';
import {ICarouselElementProps} from './ICarouselElementProps';

export const VideoElement: React.FC<ICarouselElementProps> = ({
                                                                  index,
                                                                  currentMediaIndex,
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
                                                              }) => {
    const videoPlayerRef = useRef<VideoPlayer>(null);
    const [videoStatus, setVideoStatus] = useState<IMediaStatus>(mediaStatus);

    useEffect(() => {
        // temporary fix, video metadata is not available on server
        if (mediaStatus) {
            const width = mediaStatus.width || containerWidth;
            const height = 9 / 16 * containerWidth;
            setVideoStatus({...mediaStatus, width, height});
        }
    }, [mediaStatus, containerWidth, containerHeight]);

    useEffect(() => {
        if (index !== currentMediaIndex) {
            videoPlayerRef.current?.pause();
        }
    }, [index, currentMediaIndex]);

    const thumbnailUri = mediaSource.thumbnail?.url ? encodeURI(mediaSource.thumbnail.url) : undefined;

    return (
        <MediaElement
            index={index}
            mediaSource={mediaSource}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            mediaStatus={videoStatus}
            onLongPress={onLongPress}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onSwipeDown={onSwipeDown}
            onResponderRelease={onResponderRelease}
            onHorizontalOuterRangeOffset={onHorizontalOuterRangeOffset}
        >
            <VideoPlayer
                ref={videoPlayerRef}
                paused={true}
                uri={encodeURI(mediaSource.url)}
                thumbUri={thumbnailUri}
                headers={mediaSource.props.source.headers}
                tapAnywhereToPause={false}
                disableFullscreen={true} // react-native-video 6.0.1 alpha doesn't support fullscreen yet
                doubleTapTime={300}
                externalScreenTouchProvider={true}
                hideBottomControlsWhenPaused={false}
            />
        </MediaElement>
    );
};
