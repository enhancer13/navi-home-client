import React from 'react';
import {Animated, Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ScaleAnimation} from "../../Animations";

interface AnimatedPressableProps {
  onItemPress: () => void;
  onItemLongPress?: () => void;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  children: React.ReactNode;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = props => {
  const scaleInAnimated = new ScaleAnimation();

  return (
    <Pressable
      onPress={props.onItemPress}
      onPressIn={() => {
        scaleInAnimated.startScaleInAnimation();
      }}
      onPressOut={() => {
        scaleInAnimated.startScaleOutAnimation();
      }}
      onLongPress={props.onItemLongPress}
      style={props.containerStyle}>
      <Animated.View style={[scaleInAnimated.getStyle(), styles.animatedContainer]}>
        {props.children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp(0.8),
  },
});
