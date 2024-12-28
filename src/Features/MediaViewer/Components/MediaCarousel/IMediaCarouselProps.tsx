import {IMediaSource} from '../../IMediaSource';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native';

export interface IMediaCarouselProps {
    mediaSources: IMediaSource[];
    containerWidth: number;
    containerHeight: number;
    initialIndex: number;
    useNativeDriver: boolean;
    onSwipeDown?: () => void;
    onLongPress?: (index: number) => void;
    onClick?: (index: number) => void;
    onDoubleClick?: (index: number) => void;
    slideAnimationTime?: number;
    thumbnailsContainerStyle?: StyleProp<ViewStyle> | undefined;
    onCurrentMediaIndexChange?: (index: number) => void;
}
