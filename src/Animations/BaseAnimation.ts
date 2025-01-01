import {Animated} from 'react-native';

export abstract class BaseAnimation {
    protected _animatedValue: Animated.Value;

    protected constructor(animatedValue: Animated.Value) {
        this._animatedValue = animatedValue;
    }

    public get animatedValue() {
        return this._animatedValue;
    }

    public getAnimation(toValue: number, duration: number, useNativeDriver = false): Animated.CompositeAnimation {
        return Animated.timing(this._animatedValue, {
            toValue: toValue,
            duration: duration,
            useNativeDriver: useNativeDriver,
        });
    }

    public abstract getStyle(): { [key: string]: any };

    public abstract startAnimation(toValue: number, duration?: number, useNativeDriver?: boolean, callback?: () => void): void;
}
