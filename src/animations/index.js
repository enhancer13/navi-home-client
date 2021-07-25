import {Animated} from 'react-native';

class ScaleAnimation {
  #animated;

  constructor(animated = new Animated.Value(0)) {
    this.#animated = animated;
  }

  getStyle(startSize = 1, endSize = 0.9) {
    const interpolation = this.#animated.interpolate({
      inputRange: [0, 1],
      outputRange: [startSize, endSize],
    });
    return {
      transform: [{scale: interpolation}],
    };
  }

  startScaleInAnimation(duration = 150) {
    this.#animated.setValue(0);
    this.getAnimation(1, duration).start();
  }

  startScaleOutAnimation(duration = 150) {
    this.#animated.setValue(1);
    this.getAnimation(0, duration).start();
  }

  getAnimation(toValue, duration) {
    return Animated.timing(this.#animated, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    });
  }
}

class FadeAnimation {
  #animated;

  constructor(animated) {
    this.#animated = animated;
  }

  getStyle() {
    return {
      opacity: this.#animated,
    };
  }

  startAnimation(fromValue, toValue, duration = 800) {
    this.#animated.setValue(fromValue);
    Animated.timing(this.#animated, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }
}

class SlideAnimation {
  #animated;

  constructor(animated) {
    this.#animated = animated;
  }

  getStyle() {
    return {transform: [{translateY: this.#animated}]};
  }

  startAnimation(toValue, duration = 800) {
    this.getAnimation(toValue, duration).start();
  }

  getAnimation(toValue, duration) {
    return Animated.timing(this.#animated, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: true,
    });
  }
}

export {ScaleAnimation, SlideAnimation, FadeAnimation};
