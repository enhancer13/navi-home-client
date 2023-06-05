import {Animated} from "react-native";
import {BaseAnimation} from "./BaseAnimation";

export class ResizeAnimation extends BaseAnimation {
    _dimension;

    constructor(dimension = 'height', animatedValue = new Animated.Value(0)) {
        super(animatedValue);
        this._dimension = dimension;
    }

    public override getStyle() {
        return {
            [this._dimension]: this._animatedValue,
        };
    }

    public override startAnimation(toValue: number, duration = 800) {
        this.getAnimation(toValue, duration).start();
    }
}
