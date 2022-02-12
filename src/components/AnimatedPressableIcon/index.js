import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedPressable from '../AnimatedPressable';
import PropTypes from 'prop-types';
import { LoadingActivityIndicator } from '../index';

export default class AnimatedPressableIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
    };
  }

  onPress = () => {
    const { isBusy, onPress } = this.props;
    if (isBusy) {
      return;
    }
    onPress();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.isBusy && this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isBusy: false });
    }
    if (prevProps.isBusy && !prevState.isBusy) {
      this.timeout = setTimeout(() => this.setState({ isBusy: true }), 500);
    }
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  render() {
    const {
      size,
      backgroundColor,
      IconComponent,
      iconName,
      iconColor,
      isRound,
      onPress,
      isBusy,
    } = this.props;
    if (isBusy && !this.state.isBusy) {
      this.timeout = setTimeout(() => this.setState({ isBusy: true }), 500);
    }
    return (
      <AnimatedPressable onItemPress={onPress}>
        <View
          style={[
            styles.iconContainer,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              width: size,
              height: size,
              backgroundColor: backgroundColor,
              borderRadius: isRound ? size / 2 : 0,
            },
          ]}
        >
          {isBusy ? (
            <LoadingActivityIndicator color={iconColor} />
          ) : (
            <IconComponent
              name={iconName}
              color={iconColor}
              size={size * 0.6}
            />
          )}
        </View>
      </AnimatedPressable>
    );
  }
}

AnimatedPressableIcon.propTypes = {
  size: PropTypes.number.isRequired,
  iconColor: PropTypes.string.isRequired,
  IconComponent: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isRound: PropTypes.bool,
  isBusy: PropTypes.bool,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
