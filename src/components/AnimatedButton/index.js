import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';
import {ScaleAnimation} from '../../animations';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class AnimatedButton extends Component {
  scaleAnimation = new ScaleAnimation();

  render() {
    return (
      <Pressable
        onPress={this.props.onItemPress}
        onPressIn={() => {
          this.scaleAnimation.startScaleInAnimation();
        }}
        onPressOut={() => {
          this.scaleAnimation.startScaleOutAnimation();
        }}
        onLongPress={this.props.onItemLongPress}
        style={this.props.containerStyle}>
        <Animated.View style={[this.scaleAnimation.getStyle(), styles.animatedContainer]}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </Animated.View>
      </Pressable>
    );
  }
}
const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp(0.8),
  },
  buttonText: {
    alignSelf: 'center',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
});
