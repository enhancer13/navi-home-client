import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTheme} from "react-native-paper";

interface FlexContainerProps {
  children: React.ReactNode;
  bottomTransparency?: boolean | undefined;
  topTransparency?: boolean | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}

const FlexContainer: React.FC<FlexContainerProps> = props => {
  const theme = useTheme();

  return (
    <View style={[styles.container, props.style, {backgroundColor: theme.colors.background}]}>
      {props.topTransparency ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
          style={styles.topLinearGradient}
        />
      ) : null}
      {props.children}
      {props.bottomTransparency ? (
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']}
          style={styles.bottomLinearGradient}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomLinearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(2),
    zIndex: 1,
  },
  topLinearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: hp(2),
    zIndex: 1,
  },
});

export default FlexContainer;
