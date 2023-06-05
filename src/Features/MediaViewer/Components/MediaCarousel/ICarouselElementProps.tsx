import {IMediaSource} from "../../IMediaSource";
import {IMediaStatus} from "../../IMediaStatus";

export interface ICarouselElementProps {
    index: number;
    currentMediaIndex: number;
    mediaSource: IMediaSource;
    containerWidth: number;
    containerHeight: number;
    mediaStatus: IMediaStatus;
    onHorizontalOuterRangeOffset: (offsetX: number) => void;
    onResponderRelease: (vx: number) => void;
    onSwipeDown?: () => void;
    onLongPress?: (index: number) => void;
    onClick?: (index: number) => void;
    onDoubleClick?: (index: number) => void;
}
