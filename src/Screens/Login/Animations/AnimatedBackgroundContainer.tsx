import React, {useEffect, useMemo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import backgroundIcons, {IBackgroundIcon} from './BackgroundIcons';

const iconSize = Math.min(80, wp(11));

interface IIconAnimation {
  [key: string]: Animated.Value;
}

declare type LoadingAnimationProps = {
  children?: React.ReactNode;
};

const AnimatedBackgroundContainer: React.FC<LoadingAnimationProps> = ({children}) => {
  const iconsAnimation = useMemo(() => {
    const animation: IIconAnimation = {};
    backgroundIcons.forEach((data: IBackgroundIcon) => {
      animation[data.property] = new Animated.Value(0);
      return animation;
    });
    return animation;
  }, []);

  const animatedIcons = useMemo(() => {
    return backgroundIcons.map((data: IBackgroundIcon, index) => {
      return (
        <Animated.Image
          key={index}
          source={data.image}
          style={[
            styles.animatedImage,
            data.style,
            {
              opacity: iconsAnimation[data.property],
            },
          ]}
        />
      );
    });
  }, [iconsAnimation]);

  useEffect(() => {
    backgroundIcons.forEach(data => {
      iconsAnimation[data.property].setValue(0);
      Animated.sequence([
        Animated.delay(data.delay),
        Animated.timing(iconsAnimation[data.property], {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(iconsAnimation[data.property], {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [iconsAnimation]);

  return (
      <View style={styles.container}>
        {animatedIcons}
        {children}
      </View>
  );
};

export default AnimatedBackgroundContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  animatedImage: {
    height: iconSize,
    position: 'absolute',
    resizeMode: 'contain',
    width: iconSize,
  },
});
