import {ReactNode} from "react";
import {ViewStyle} from "react-native";
import {IMediaSource} from "./IMediaSource";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";

export interface IMediaViewerProps {
    mediaSources: IMediaSource[];
    initialIndex?: number;
    enablePreload?: boolean;
    useNativeDriver?: boolean;
    showThumbnails?: boolean;
    onLongPress?: (index: number) => void;
    onClick?: (index: number) => void;
    onDoubleClick?: (index: number) => void;
    onSwipeDown?: () => void;
    enableSwipeDown?: boolean;
    swipeDownThreshold?: number;
    footerContainerStyle?: object;
    renderFooter?: () => ReactNode;
    backgroundColor?: string;
    slideAnimationTime?: number;
    thumbnailsContainerStyle?: StyleProp<ViewStyle> | undefined
    onCurrentIndexChanged?: (index: number) => void;
}
