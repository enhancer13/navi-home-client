import {Animated} from "react-native";
import {BaseAnimation} from "./BaseAnimation";

export class ScaleAnimation extends BaseAnimation {
  private readonly _dimension;

  constructor(dimension = 'both', animated = new Animated.Value(0)) {
    super(animated);
    this._dimension = dimension;
  }

  public override getStyle(startSize = 1, endSize = 0.9) {
    const interpolation = this._animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [startSize, endSize],
    });

    switch (this._dimension) {
      case 'x':
        return {transform: [{scaleX: interpolation}]};
      case 'y':
        return {transform: [{scaleY: interpolation}]};
      default:
        return {transform: [{scale: interpolation}]};
    }
  }
  override startAnimation(toValue: number, duration = 150): void {
    this.getAnimation(toValue, duration).start();
  }

  public startScaleInAnimation(duration = 150) {
    this._animatedValue.setValue(0);
    this.getAnimation(1, duration).start();
  }

  public startScaleOutAnimation(duration = 150) {
    this._animatedValue.setValue(1);
    this.getAnimation(0, duration).start();
  }

  public override getAnimation(toValue: number, duration: number) {
    return Animated.timing(this._animatedValue, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    });
  }
}
