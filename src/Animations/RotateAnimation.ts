import {Animated} from 'react-native';
import {BaseAnimation} from './BaseAnimation';

export class RotateAnimation extends BaseAnimation {
    constructor(animated = new Animated.Value(0)) {
        super(animated);
    }

    public override getStyle(startAngle = '0deg', endAngle = '180deg') {
        const interpolation = this._animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [startAngle, endAngle],
        });
        return {
            transform: [{rotate: interpolation}],
        };
    }

    public override startAnimation(toValue: number, duration = 150): void {
        this.getAnimation(toValue, duration).start();
    }
}
