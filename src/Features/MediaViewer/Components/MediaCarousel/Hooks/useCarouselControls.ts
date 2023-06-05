import {Animated, I18nManager} from "react-native";
import {useRef, useState} from "react";
import {IMediaSource} from "../../../IMediaSource";

export const useCarouselControls = (mediaSources: IMediaSource[], containerWidth: number, useNativeDriver: boolean, slideAnimationTime: number) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const standardPositionXRef = useRef(0);
    const positionXNumberRef = useRef(0);
    const positionXAnimationRef = useRef(new Animated.Value(0));

    const goToIndex = (index: number, animateTime = slideAnimationTime) => {
        if (index < 0 || index >= mediaSources.length) {
            resetPosition();
            return;
        }

        positionXNumberRef.current = (!I18nManager.isRTL ? -1 : 1) * index * containerWidth;
        standardPositionXRef.current = positionXNumberRef.current;
        Animated.timing(positionXAnimationRef.current, {
            toValue: positionXNumberRef.current,
            duration: animateTime,
            useNativeDriver: useNativeDriver,
        }).start();

        setCurrentMediaIndex(index);
    };

    const goBack = () => goToIndex(currentMediaIndex - 1);

    const goNext = () => goToIndex(currentMediaIndex + 1);

    const resetPosition = () => {
        if (currentMediaIndex >= mediaSources.length) {
            goToIndex(mediaSources.length - 1);
            return;
        }

        positionXNumberRef.current = standardPositionXRef.current;
        Animated.timing(positionXAnimationRef.current, {
            toValue: standardPositionXRef.current,
            duration: 150,
            useNativeDriver: useNativeDriver,
        }).start();
    }

    return {
        currentMediaIndex,
        positionXNumberRef,
        standardPositionXRef,
        positionXAnimationRef,
        resetPosition,
        goBack,
        goNext,
        goToIndex
    };
}
