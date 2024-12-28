import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {MediaCarousel} from './Components/MediaCarousel/MediaCarousel';
import {IMediaViewerProps} from './IMediaViewerProps';
import {FadeAnimation} from '../../Animations';
import {LayoutChangeEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {useTheme} from 'react-native-paper';


const DEFAULT_FADE_ANIMATION_DURATION = 500;

export const MediaViewer: React.FC<IMediaViewerProps> = (props: IMediaViewerProps) => {
    const {onSwipeDown, onClick, onLongPress, onDoubleClick} = props;
    const fadeAnimationRef = useRef(new FadeAnimation());
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [layout, setLayout] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        fadeAnimationRef.current.startAnimation(1, DEFAULT_FADE_ANIMATION_DURATION, props.useNativeDriver);
    }, [props.useNativeDriver]);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        if (event.nativeEvent.layout.width !== width) {
            setWidth(event.nativeEvent.layout.width);
            setHeight(event.nativeEvent.layout.height);
            setLayout(true);
        }
    }, [width]);

    return (
        <View onLayout={onLayout} style={styles.container}>
            {layout && (
                <Animated.View
                    style={[{backgroundColor: theme.colors.background}, fadeAnimationRef.current.getStyle()]}>
                    <MediaCarousel mediaSources={props.mediaSources}
                                   containerWidth={width}
                                   containerHeight={height}
                                   initialIndex={props.initialIndex || 0}
                                   onClick={onClick}
                                   onDoubleClick={onDoubleClick}
                                   onLongPress={onLongPress}
                                   onSwipeDown={onSwipeDown}
                                   useNativeDriver={!!props.useNativeDriver}
                                   thumbnailsContainerStyle={props.thumbnailsContainerStyle}
                                   onCurrentMediaIndexChange={props.onCurrentIndexChanged}
                    />
                    {props.renderFooter && props.renderFooter()}
                </Animated.View>)
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
});
