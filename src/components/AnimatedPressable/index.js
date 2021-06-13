import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import {ScaleAnimation} from '../../animations';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class AnimatedPressable extends Component {
  scaleInAnimated = new Animated.Value(0);
  scaleOutAnimated = new Animated.Value(0);

  render() {
    return (
      <Pressable
        onPress={this.props.onItemPress}
        onPressIn={() => {
          ScaleAnimation.pressInAnimation(this.scaleInAnimated);
        }}
        onPressOut={() => {
          ScaleAnimation.pressOutAnimation(this.scaleInAnimated);
        }}
        onLongPress={this.props.onItemLongPress}
        style={this.props.containerStyle}>
        <Animated.View style={[ScaleAnimation.getScaleTransformationStyle(this.scaleInAnimated), styles.animatedContainer]}>
          {this.props.children}
        </Animated.View>
      </Pressable>
    );
  }
}
const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp(0.8),
  },
});
