import {MD3Theme as Theme} from 'react-native-paper';
import {Animated} from 'react-native';

export const elevationShadowStyle = (theme: Theme, elevation = 3) => {
    return {
        elevation, // Android
        shadowColor: theme.colors.shadow, // iOS
        shadowOffset: { width: 0, height: 0.5 * elevation }, // iOS
        shadowOpacity:  elevation ? 0.3 : 0, // iOS
        shadowRadius: 0.8 * elevation, // iOS
    };
};

export const animatedElevationShadowStyle = (theme: Theme, elevation: Animated.AnimatedInterpolation<number>) => {
    return {
        elevation, // Android
        shadowColor: theme.colors.shadow, // iOS
        shadowOffset: {
            width: 0,
            height: elevation.interpolate({
                inputRange: [0, 10],
                outputRange: [0, 5],
                extrapolate: 'clamp',
            }),
        }, // iOS
        shadowOpacity: elevation.interpolate({
            inputRange: [0, 10],
            outputRange: [0, 0.3],
            extrapolate: 'clamp',
        }), // iOS
        shadowRadius: elevation.interpolate({
            inputRange: [0, 10],
            outputRange: [0, 4],
            extrapolate: 'clamp',
        }), // iOS
    };
};
