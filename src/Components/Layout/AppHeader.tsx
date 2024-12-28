import React, {useCallback} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {useToggle} from '../Hooks/useToggle';
import {useNavigation} from '@react-navigation/native';
import {SearchBar} from './SearchBar';
import {animatedElevationShadowStyle} from '../../Helpers/StyleUtils';
import {IconButton, MD3Theme as Theme, useTheme, Text} from 'react-native-paper';
import SafeAreaView from './SafeAreaView';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    height?: number;
    enableBackButton?: boolean;
    enableSearch?: boolean;
    onSearchQueryChange?: (query: string) => void;
    scrollY?: Animated.Value;
    scrollThreshold?: number;
    enableTitleAnimation?: boolean;
    leftControl?: React.ReactNode;
    rightControl?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
                                                       title,
                                                       subtitle,
                                                       height = hp(5),
                                                       enableBackButton = false,
                                                       enableSearch = false,
                                                       onSearchQueryChange,
                                                       scrollY = new Animated.Value(0),
                                                       scrollThreshold = 0,
                                                       enableTitleAnimation = false,
                                                       leftControl,
                                                       rightControl,
                                                   }) => {
    const navigation = useNavigation();
    const [searchActive, toggleSearchActive] = useToggle(false);

    const handleSearchQueryChange = useCallback((query: string) => {
        onSearchQueryChange?.(query);
    }, [onSearchQueryChange]);

    const handleBackPress = useCallback(() => {
        enableBackButton && navigation.goBack();
    }, [navigation, enableBackButton]);

    const handleSearchPress = useCallback(() => {
        enableSearch && toggleSearchActive();
    }, [enableSearch, toggleSearchActive]);

    const theme = useTheme();
    const backgroundColor = theme.colors.background;

    const containerElevation = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + height],
        outputRange: [0, 5],
        extrapolate: 'clamp',
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + height],
        outputRange: [height, 0],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + height],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });


    const styles = createStyles(theme, backgroundColor, containerElevation);
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, {height: height}]}>
                {leftControl ? leftControl : <IconButton icon={'arrow-left'} onPress={handleBackPress}
                                                         iconColor={enableBackButton ? theme.colors.onBackground : backgroundColor}/>}
                <Animated.View style={enableTitleAnimation ? {
                    transform: [{translateY: titleTranslateY}],
                    opacity: titleOpacity,
                } : {}}>
                    {title && <Text numberOfLines={1} variant="titleMedium" style={styles.title}>{title}</Text>}
                    {subtitle &&
                      <Text numberOfLines={1} variant="labelMedium" style={styles.subheaderText}>{subtitle}</Text>}
                </Animated.View>
                {rightControl ? rightControl : <IconButton icon={'magnify'} onPress={handleSearchPress}
                                                           iconColor={enableSearch ? theme.colors.onBackground : backgroundColor}/>}
            </View>
            {enableSearch &&
              <SearchBar searchActive={searchActive} onSearchQueryChange={handleSearchQueryChange} debounceTime={500}/>}
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme, backgroundColor: string, elevation: Animated.AnimatedInterpolation<number>) => StyleSheet.create({

    // @ts-ignore
    container: {
        ...animatedElevationShadowStyle(theme, elevation),
        backgroundColor: theme.colors.background,
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
        backgroundColor,
        overflow: 'hidden',
    },
    title: {
        color: theme.colors.onBackground,
    },
    subheader: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        backgroundColor,
    },
    subheaderText: {
        color: theme.colors.onBackground,
    },
});
