import {Animated} from 'react-native';
import {BaseAnimation} from './BaseAnimation';

export class FadeAnimation extends BaseAnimation {
    constructor(animated = new Animated.Value(0)) {
        super(animated);
    }

    public override getStyle() {
        return {
            opacity: this._animatedValue,
        };
    }

    public override startAnimation(toValue: number, duration = 800, useNativeDriver = false) {
        this.getAnimation(toValue, duration, useNativeDriver).start();
    }
}
