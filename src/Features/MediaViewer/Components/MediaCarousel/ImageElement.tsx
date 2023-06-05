import React from "react";
import {MediaElement} from "./MediaElement";
import FastImage from "react-native-fast-image";
import {ICarouselElementProps} from "./ICarouselElementProps";

export const ImageElement: React.FC<ICarouselElementProps> = ({
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
                                                              }) => {
    return (
        <MediaElement
            index={index}
            mediaSource={mediaSource}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            mediaStatus={mediaStatus}
            onLongPress={onLongPress}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onSwipeDown={onSwipeDown}
            onResponderRelease={onResponderRelease}
            onHorizontalOuterRangeOffset={onHorizontalOuterRangeOffset}
        >
            {(width, height) =>
                (<FastImage
                    style={{width, height}}
                    source={{
                        uri: mediaSource.url,
                        headers: mediaSource.props.source.headers,
                        priority: FastImage.priority.normal,
                    }}
                />)}
        </MediaElement>
    );
};
