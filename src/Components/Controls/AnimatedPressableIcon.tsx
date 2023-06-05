import React, {Component} from 'react';
import {ColorValue, StyleSheet, View} from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import {LoadingActivityIndicator} from './LoadingActivityIndicator';
import {IconProps} from 'react-native-vector-icons/Icon';

interface IAnimatedPressableIconProps {
  isBusy: boolean;
  onPress: () => void;
  size: number;
  backgroundColor: ColorValue;
  IconComponent: React.ComponentType<IconProps>;
  iconName: string;
  iconColor: ColorValue;
  isRound: boolean;
}

interface IAnimatedPressableIconState {
  isBusy: boolean;
}

export default class AnimatedPressableIcon extends Component<
  IAnimatedPressableIconProps,
  IAnimatedPressableIconState
> {
  private timeout: any | null;

  constructor(props: IAnimatedPressableIconProps) {
    super(props);

    this.state = {
      isBusy: false,
    };
  }

  onPress = () => {
    const {isBusy, onPress} = this.props;
    if (isBusy) {
      return;
    }
    onPress();
  };

  componentDidUpdate(
    prevProps: IAnimatedPressableIconProps,
    prevState: IAnimatedPressableIconState,
  ) {
    if (!prevProps.isBusy && this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.setState({isBusy: false});
    }
    if (prevProps.isBusy && !prevState.isBusy) {
      this.timeout = setTimeout(() => this.setState({isBusy: true}), 500);
    }
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  render() {
    const {size, backgroundColor, IconComponent, iconName, iconColor, isRound, onPress, isBusy} =
      this.props;
    if (isBusy && !this.state.isBusy) {
      this.timeout = setTimeout(() => this.setState({isBusy: true}), 500);
    }
    return (
      <AnimatedPressable onItemPress={onPress}>
        <View
          style={[
            styles.iconContainer,
            {
              width: size,
              height: size,
              backgroundColor: backgroundColor,
              borderRadius: isRound ? size / 2 : 0,
            },
          ]}>
          {isBusy ? (
            <LoadingActivityIndicator color={iconColor} />
          ) : (
            <IconComponent name={iconName} color={iconColor} size={size * 0.6} />
          )}
        </View>
      </AnimatedPressable>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
