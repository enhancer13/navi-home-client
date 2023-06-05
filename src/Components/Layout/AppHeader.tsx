import React, {useCallback, useRef} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {useToggle} from "../Hooks/useToggle";
import {useNavigation} from "@react-navigation/native";
import {SearchBar} from "../../Features/EntityList/Components/SearchBar";
import {animatedElevationShadowStyle} from "../../Helpers/StyleUtils";
import {IconButton, MD3Theme as Theme, useTheme, Text} from "react-native-paper";
import SafeAreaView from "./SafeAreaView";
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";

interface MyHeaderProps {
    title?: string;
    subtitle?: string;
    enableBackButton?: boolean;
    enableSearch?: boolean;
    onSearchQueryChange?: (query: string) => void;
    scrollY?: Animated.Value;
    scrollThreshold?: number;
    enableTitleAnimation?: boolean;
    leftControl?: React.ReactNode;
    rightControl?: React.ReactNode;
}

const SCROLL_DISTANCE_FOR_ANIMATION = 50;

export const AppHeader: React.FC<MyHeaderProps> = ({
                                                       title,
                                                       subtitle,
                                                       enableBackButton = false,
                                                       enableSearch = false,
                                                       onSearchQueryChange,
                                                       scrollY = new Animated.Value(0),
                                                       scrollThreshold = 0,
                                                       enableTitleAnimation = false,
                                                       leftControl,
                                                       rightControl
                                                   }) => {
    const navigation = useNavigation();
    const [searchActive, toggleSearchActive] = useToggle(false);
    const titleHeightRef = useRef(SCROLL_DISTANCE_FOR_ANIMATION);

    const handleSearchQueryChange = useCallback((query: string) => {
        onSearchQueryChange && onSearchQueryChange(query);
    }, [onSearchQueryChange]);

    const handleBackPress = useCallback(() => {
        enableBackButton && navigation.goBack();
    }, [navigation]);

    const handleSearchPress = useCallback(() => {
        enableSearch && toggleSearchActive();
    }, []);

    const theme = useTheme();
    const backgroundColor = theme.colors.background;

    const containerElevation = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + SCROLL_DISTANCE_FOR_ANIMATION],
        outputRange: [0, 10],
        extrapolate: 'clamp',
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + SCROLL_DISTANCE_FOR_ANIMATION],
        outputRange: [titleHeightRef.current, 0],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [scrollThreshold, scrollThreshold + SCROLL_DISTANCE_FOR_ANIMATION],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        titleHeightRef.current = event.nativeEvent.layout.height;
    }, []);

    const styles = createStyles(theme, backgroundColor, containerElevation);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {leftControl ? leftControl : <IconButton icon={"arrow-left"} onPress={handleBackPress} iconColor={enableBackButton ? theme.colors.onBackground : backgroundColor}/>}
                <Animated.View style={enableTitleAnimation ? {transform: [{translateY: titleTranslateY}], opacity: titleOpacity} : {}} onLayout={handleLayout}>
                    {title && <Text variant="titleMedium" style={styles.title}>{title}</Text>}
                    {subtitle && <Text variant="labelMedium" style={styles.subheaderText}>{subtitle}</Text>}
                </Animated.View>
                {rightControl ? rightControl : <IconButton icon={"magnify"} onPress={handleSearchPress} iconColor={enableSearch ? theme.colors.onBackground : backgroundColor}/>}
            </View>
            {enableSearch && <SearchBar searchActive={searchActive} onSearchQueryChange={handleSearchQueryChange} debounceTime={500}/>}
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme, backgroundColor: string, elevation: Animated.AnimatedInterpolation<number>) => StyleSheet.create({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    },
    title: {
        color: theme.colors.onBackground,
    },
    subheader: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        backgroundColor
    },
    subheaderText: {
        color: theme.colors.onBackground,
    },
});
