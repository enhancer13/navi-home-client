import {Animated, LayoutChangeEvent, PanResponder, StyleSheet, View} from 'react-native';
import * as React from "react";
import {ICenterOn} from "./ICenterOn";
import {ImageZoomProps} from "./ImageZoomProps";
import {ImageZoomState} from "./ImageZoomState";

// clone of react-native-image-pan-zoom with minor bug fixes
export default class ImageViewer extends React.Component<ImageZoomProps, ImageZoomState> {
    public static defaultProps = new ImageZoomProps();
    public state = new ImageZoomState();

    private lastPositionX: number | null = null;
    private positionX = 0;
    private animatedPositionX = new Animated.Value(0);

    private lastPositionY: number | null = null;
    private positionY = 0;
    private animatedPositionY = new Animated.Value(0);

    private scale = 1;
    private animatedScale = new Animated.Value(1);
    private zoomLastDistance: number | null = null;
    private zoomCurrentDistance = 0;

    private lastTouchStartTime = 0;

    private horizontalWholeOuterCounter = 0;

    private swipeDownOffset = 0;

    private horizontalWholeCounter = 0;
    private verticalWholeCounter = 0;

    private centerDiffX = 0;
    private centerDiffY = 0;

    private singleClickTimeout: NodeJS.Timeout | undefined;

    private longPressTimeout: NodeJS.Timeout | undefined;

    private lastClickTime = 0;

    private doubleClickX = 0;
    private doubleClickY = 0;

    private isDoubleClick = false;

    private isLongPress = false;

    private isHorizontalWrap = false;

    private imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: this.props.onStartShouldSetPanResponder,
        onPanResponderTerminationRequest: this.props.onPanResponderTerminationRequest,
        onMoveShouldSetPanResponder: this.props.onMoveShouldSetPanResponder,

        onPanResponderGrant: (evt) => {
            this.lastPositionX = null;
            this.lastPositionY = null;
            this.zoomLastDistance = null;
            this.horizontalWholeCounter = 0;
            this.verticalWholeCounter = 0;
            this.lastTouchStartTime = new Date().getTime();
            this.isDoubleClick = false;
            this.isLongPress = false;
            this.isHorizontalWrap = false;

            if (this.singleClickTimeout) {
                clearTimeout(this.singleClickTimeout);
            }

            if (evt.nativeEvent.changedTouches.length > 1) {
                const centerX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2;
                this.centerDiffX = centerX - this.props.cropWidth / 2;

                const centerY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2;
                this.centerDiffY = centerY - this.props.cropHeight / 2;
            }

            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }
            const {locationX, locationY, pageX, pageY} = evt.nativeEvent;
            this.longPressTimeout = setTimeout(() => {
                this.isLongPress = true;
                if (this.props.onLongPress) {
                    this.props.onLongPress({locationX, locationY, pageX, pageY});
                }
            }, this.props.longPressTime);

            if (evt.nativeEvent.changedTouches.length <= 1) {
                if (new Date().getTime() - this.lastClickTime < (this.props.doubleClickInterval || 0)) {
                    this.lastClickTime = 0;

                    this.doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
                    this.doubleClickY = evt.nativeEvent.changedTouches[0].pageY;

                    if (this.props.onDoubleClick) {
                        this.props.onDoubleClick({
                            locationX: evt.nativeEvent.changedTouches[0].locationX,
                            locationY: evt.nativeEvent.changedTouches[0].locationY,
                            pageX: this.doubleClickX,
                            pageY: this.doubleClickY,
                        });
                    }

                    clearTimeout(this.longPressTimeout);

                    this.isDoubleClick = true;

                    if (this.props.enableDoubleClickZoom) {
                        if (this.scale > 1 || this.scale < 1) {
                            this.scale = 1;

                            this.positionX = 0;
                            this.positionY = 0;
                        } else {
                            const beforeScale = this.scale;
                            this.scale = 2;
                            const diffScale = this.scale - beforeScale;
                            this.positionX = ((this.props.cropWidth / 2 - this.doubleClickX) * diffScale) / this.scale;
                            this.positionY = ((this.props.cropHeight / 2 - this.doubleClickY) * diffScale) / this.scale;
                        }

                        this.imageDidMove('centerOn');

                        Animated.parallel([
                            Animated.timing(this.animatedScale, {
                                toValue: this.scale,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                            Animated.timing(this.animatedPositionX, {
                                toValue: this.positionX,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                            Animated.timing(this.animatedPositionY, {
                                toValue: this.positionY,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                        ]).start();
                    }
                } else {
                    this.lastClickTime = new Date().getTime();
                }
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            if (this.isDoubleClick) {
                return;
            }

            if (evt.nativeEvent.changedTouches.length <= 1) {
                let diffX = gestureState.dx - (this.lastPositionX || 0);
                if (this.lastPositionX === null) {
                    diffX = 0;
                }
                let diffY = gestureState.dy - (this.lastPositionY || 0);
                if (this.lastPositionY === null) {
                    diffY = 0;
                }

                this.lastPositionX = gestureState.dx;
                this.lastPositionY = gestureState.dy;

                this.horizontalWholeCounter += diffX;
                this.verticalWholeCounter += diffY;

                if (Math.abs(this.horizontalWholeCounter) > 5 || Math.abs(this.verticalWholeCounter) > 5) {
                    clearTimeout(this.longPressTimeout);
                }

                if (this.props.panToMove) {
                    if (this.swipeDownOffset === 0) {
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            this.isHorizontalWrap = true;
                        }

                        if (this.props.imageWidth * this.scale > this.props.cropWidth) {
                            if (this.horizontalWholeOuterCounter > 0) {
                                if (diffX < 0) {
                                    if (this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                        this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    } else {
                                        diffX += this.horizontalWholeOuterCounter;
                                        this.horizontalWholeOuterCounter = 0;
                                        if (this.props.horizontalOuterRangeOffset) {
                                            this.props.horizontalOuterRangeOffset(0);
                                        }
                                    }
                                } else {
                                    this.horizontalWholeOuterCounter += diffX;
                                }
                            } else if (this.horizontalWholeOuterCounter < 0) {
                                if (diffX > 0) {
                                    if (Math.abs(this.horizontalWholeOuterCounter) > diffX) {
                                        this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    } else {
                                        diffX += this.horizontalWholeOuterCounter;
                                        this.horizontalWholeOuterCounter = 0;
                                        if (this.props.horizontalOuterRangeOffset) {
                                            this.props.horizontalOuterRangeOffset(0);
                                        }
                                    }
                                } else {
                                    this.horizontalWholeOuterCounter += diffX;
                                }
                            }

                            this.positionX += diffX / this.scale;
                            const horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale;
                            if (this.positionX < -horizontalMax) {
                                this.positionX = -horizontalMax;
                                this.horizontalWholeOuterCounter += -1 / 1e10;
                            } else if (this.positionX > horizontalMax) {
                                this.positionX = horizontalMax;
                                this.horizontalWholeOuterCounter += 1 / 1e10;
                            }
                            this.animatedPositionX.setValue(this.positionX);
                        } else {
                            this.horizontalWholeOuterCounter += diffX;
                        }

                        if (this.horizontalWholeOuterCounter > (this.props.maxOverflow || 0)) {
                            this.horizontalWholeOuterCounter = this.props.maxOverflow || 0;
                        } else if (this.horizontalWholeOuterCounter < -(this.props.maxOverflow || 0)) {
                            this.horizontalWholeOuterCounter = -(this.props.maxOverflow || 0);
                        }

                        if (this.horizontalWholeOuterCounter !== 0) {
                            if (this.props.horizontalOuterRangeOffset) {
                                this.props.horizontalOuterRangeOffset(this.horizontalWholeOuterCounter);
                            }
                        }
                    }

                    if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                        this.positionY += diffY / this.scale;
                        this.animatedPositionY.setValue(this.positionY);
                    } else {
                        if (this.props.enableSwipeDown && !this.isHorizontalWrap) {
                            this.swipeDownOffset += diffY;

                            if (this.swipeDownOffset > 0) {
                                this.positionY += diffY / this.scale;
                                this.animatedPositionY.setValue(this.positionY);
                                this.scale = this.scale - diffY / 1000;
                                this.animatedScale.setValue(this.scale);
                            }
                        }
                    }
                }
            } else {
                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout);
                }

                if (this.props.pinchToZoom) {
                    let minX: number;
                    let maxX: number;
                    if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
                        minX = evt.nativeEvent.changedTouches[1].pageX;
                        maxX = evt.nativeEvent.changedTouches[0].pageX;
                    } else {
                        minX = evt.nativeEvent.changedTouches[0].pageX;
                        maxX = evt.nativeEvent.changedTouches[1].pageX;
                    }

                    let minY: number;
                    let maxY: number;
                    if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
                        minY = evt.nativeEvent.changedTouches[1].pageY;
                        maxY = evt.nativeEvent.changedTouches[0].pageY;
                    } else {
                        minY = evt.nativeEvent.changedTouches[0].pageY;
                        maxY = evt.nativeEvent.changedTouches[1].pageY;
                    }

                    const widthDistance = maxX - minX;
                    const heightDistance = maxY - minY;
                    const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                    this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));

                    if (this.zoomLastDistance !== null) {
                        const distanceDiff = (this.zoomCurrentDistance - this.zoomLastDistance) / 200;
                        let zoom = this.scale + distanceDiff;

                        if (zoom < (this.props.minScale || 0)) {
                            zoom = this.props.minScale || 0;
                        }
                        if (zoom > (this.props.maxScale || 0)) {
                            zoom = this.props.maxScale || 0;
                        }

                        const beforeScale = this.scale;
                        this.scale = zoom;
                        this.animatedScale.setValue(this.scale);
                        const diffScale = this.scale - beforeScale;
                        this.positionX -= (this.centerDiffX * diffScale) / this.scale;
                        this.positionY -= (this.centerDiffY * diffScale) / this.scale;
                        this.animatedPositionX.setValue(this.positionX);
                        this.animatedPositionY.setValue(this.positionY);
                    }
                    this.zoomLastDistance = this.zoomCurrentDistance;
                }
            }

            this.imageDidMove('onPanResponderMove');
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }

            if (this.isDoubleClick) {
                return;
            }

            if (this.isLongPress) {
                return;
            }

            const moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
            const {locationX, locationY, pageX, pageY} = evt.nativeEvent;

            if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < (this.props.clickDistance || 0)) {
                this.singleClickTimeout = setTimeout(() => {
                    if (this.props.onClick) {
                        this.props.onClick({locationX, locationY, pageX, pageY});
                    }
                }, this.props.doubleClickInterval);
            } else {
                if (this.props.responderRelease) {
                    this.props.responderRelease(gestureState.vx, this.scale);
                }

                this.panResponderReleaseResolve();
            }
        },
        onPanResponderTerminate: () => {
            //
        },
    });
    public panResponderReleaseResolve = (): void => {
        if (this.props.enableSwipeDown && this.props.swipeDownThreshold) {
            if (this.swipeDownOffset > this.props.swipeDownThreshold) {
                this.props.onSwipeDown && this.props.onSwipeDown();
                return;
            }
        }

        if (this.props.enableCenterFocus && this.scale < 1) {
            this.scale = 1;
            Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        if (this.props.imageWidth * this.scale <= this.props.cropWidth) {
            this.positionX = 0;
            Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        if (this.props.imageHeight * this.scale <= this.props.cropHeight) {
            this.positionY = 0;
            Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        if (this.props.imageHeight * this.scale > this.props.cropHeight) {
            const verticalMax = (this.props.imageHeight * this.scale - this.props.cropHeight) / 2 / this.scale;
            if (this.positionY < -verticalMax) {
                this.positionY = -verticalMax;
            } else if (this.positionY > verticalMax) {
                this.positionY = verticalMax;
            }
            Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        if (this.props.imageWidth * this.scale > this.props.cropWidth) {
            const horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale;
            if (this.positionX < -horizontalMax) {
                this.positionX = -horizontalMax;
            } else if (this.positionX > horizontalMax) {
                this.positionX = horizontalMax;
            }
            Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        if (this.props.enableCenterFocus && this.scale === 1) {
            this.positionX = 0;
            this.positionY = 0;
            Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
            Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }

        this.horizontalWholeOuterCounter = 0;
        this.swipeDownOffset = 0;
        this.imageDidMove('onPanResponderRelease');
    };

    public componentDidMount(): void {
        if (this.props.centerOn) {
            this.centerOn(this.props.centerOn);
        }
    }

    public componentDidUpdate(prevProps: ImageZoomProps): void {
        if (
            (this.props.centerOn && !prevProps.centerOn) ||
            (this.props.centerOn && prevProps.centerOn && this.didCenterOnChange(prevProps.centerOn, this.props.centerOn))
        ) {
            this.centerOn(this.props.centerOn);
        }
    }

    public imageDidMove(type: string): void {
        if (this.props.onMove) {
            this.props.onMove({
                type,
                positionX: this.positionX,
                positionY: this.positionY,
                scale: this.scale,
                zoomCurrentDistance: this.zoomCurrentDistance,
            });
        }
    }

    public didCenterOnChange(
        params: { x: number; y: number; scale: number; duration: number },
        paramsNext: { x: number; y: number; scale: number; duration: number }
    ): boolean {
        return params.x !== paramsNext.x || params.y !== paramsNext.y || params.scale !== paramsNext.scale;
    }

    public centerOn(params: ICenterOn): void {
        this.positionX = params.x;
        this.positionY = params.y;
        this.scale = params.scale;
        const duration = params.duration || 300;
        Animated.parallel([
            Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
            Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
            Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
        ]).start(() => {
            this.imageDidMove('centerOn');
        });
    }

    public handleLayout(event: LayoutChangeEvent): void {
        if (this.props.layoutChange) {
            this.props.layoutChange(event);
        }
    }

    public render(): React.ReactNode {
        const animateConf = {
            transform: [
                {
                    scale: this.animatedScale,
                },
                {
                    translateX: this.animatedPositionX,
                },
                {
                    translateY: this.animatedPositionY,
                },
            ],
        };

        const parentStyles = StyleSheet.flatten(this.props.style);

        return (
            <View
                style={{
                    ...styles.container,
                    ...parentStyles,
                    width: this.props.cropWidth,
                    height: this.props.cropHeight,
                }}
                {...this.imagePanResponder.panHandlers}
            >
                <Animated.View style={animateConf}
                               renderToHardwareTextureAndroid={this.props.useHardwareTextureAndroid}>
                    <View
                        onLayout={this.handleLayout.bind(this)}
                        style={{
                            width: this.props.imageWidth,
                            height: this.props.imageHeight,
                        }}
                    >
                        {this.props.children}
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent'
    }
})
