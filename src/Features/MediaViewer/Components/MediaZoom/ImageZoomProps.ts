import {ICenterOn} from './ICenterOn';
import {GestureResponderEvent, LayoutChangeEvent, PanResponderGestureState, ViewStyle} from 'react-native';
import {IOnClick} from './IOnClick';
import {IOnMove} from './IOnMove';
import * as React from 'react';

export class ImageZoomProps {
    public cropWidth = 100;

    public cropHeight = 100;

    public imageWidth = 100;

    public imageHeight = 100;

    public panToMove? = true;

    public pinchToZoom?: boolean = true;

    public enableDoubleClickZoom?: boolean = true;

    public clickDistance?: number = 10;

    public maxOverflow?: number = 100;

    public longPressTime?: number = 800;

    public doubleClickInterval?: number = 175;

    public centerOn?: ICenterOn;

    public style?: ViewStyle = {};

    public swipeDownThreshold?: number = 230;

    public enableSwipeDown?: boolean = false;

    public enableCenterFocus?: boolean = true;

    public useHardwareTextureAndroid?: boolean = true;

    public minScale?: number = 0.6;

    public maxScale?: number = 10;

    public useNativeDriver?: boolean = false;

    public onClick?: (eventParams: IOnClick) => void = () => undefined;

    public onDoubleClick?: (eventParams: IOnClick) => void = () => undefined;

    public onLongPress?: (eventParams: IOnClick) => void = () => undefined;

    public horizontalOuterRangeOffset?: (offsetX: number) => void = () => undefined;

    public onDragLeft?: () => void = () => undefined;

    public responderRelease?: (vx: number, scale: number) => void = () => undefined;

    public onMove?: (position: IOnMove) => void = () => undefined;

    public layoutChange?: (event: LayoutChangeEvent) => void = () => undefined;

    public onSwipeDown?: () => void = () => undefined;

    public onMoveShouldSetPanResponder?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;

    public onStartShouldSetPanResponder?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean = () => true;

    public onPanResponderTerminationRequest?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean = () => false;

    public children: React.ReactNode;
}
