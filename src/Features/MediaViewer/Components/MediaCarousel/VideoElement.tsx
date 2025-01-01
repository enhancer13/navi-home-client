import React, {useEffect, useRef, useState} from 'react';
import {MediaElement} from './MediaElement';
import {IMediaStatus} from '../../IMediaStatus';
import {ICarouselElementProps} from './ICarouselElementProps';
import {VideoPlayer, VideoPlayerRef} from '../../../VideoPlayer';

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
    const videoPlayerRef = useRef<VideoPlayerRef>(null);
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

    const aspectRatio = videoStatus.width / videoStatus.height;

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
                posterUri={mediaSource.thumbnail?.url}
                sourceUri={mediaSource.url}
                headers={mediaSource.props.source.headers}
                aspectRatio={aspectRatio}
            />
        </MediaElement>
    );
};
