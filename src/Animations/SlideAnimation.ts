import {Animated} from "react-native";
import {BaseAnimation} from "./BaseAnimation";

export class SlideAnimation extends BaseAnimation {
    _dimension;

    constructor(dimension = 'y', animatedValue = new Animated.Value(0)) {
        super(animatedValue);
        this._dimension = dimension;
    }

    public getStyle(config: (animatedValue: Animated.Value) => Animated.AnimatedInterpolation<number> = (animatedValue) => animatedValue) {
        const animatedValue = config(this._animatedValue);

        switch (this._dimension) {
            case 'x':
                return {transform: [{translateX: animatedValue}]};
            case 'y':
                return {transform: [{translateY: animatedValue}]};
            default:
                return {transform: [{translateY: animatedValue}]};
        }
    }

    public override startAnimation(toValue: number, duration = 800, useNativeDriver = false, callback?: () => void) {
        this.getAnimation(toValue, duration, useNativeDriver).start(callback);
    }
}
