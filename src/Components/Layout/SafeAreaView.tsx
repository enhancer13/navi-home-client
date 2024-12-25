import {
    Animated,
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    KeyboardAvoidingView,
} from 'react-native';
import React, {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper";

declare type FlexSafeAreaViewProps = {
    children?: React.ReactNode;
    ignoreTopInsets?: boolean | undefined;
    ignoreBottomInsets?: boolean | undefined;
    enableKeyboardAvoiding?: boolean | undefined; // New Prop
    keyboardVerticalOffset?: number; // Optional offset for KeyboardAvoidingView
    style?: StyleProp<ViewStyle> | undefined;
};

const SafeAreaView: React.FC<FlexSafeAreaViewProps> = ({
                                                           children,
                                                           ignoreTopInsets = false,
                                                           ignoreBottomInsets = true,
                                                           enableKeyboardAvoiding = false,
                                                           keyboardVerticalOffset = 0,
                                                           style,
                                                       }) => {
    const insets = useSafeAreaInsets();
    const top = ignoreTopInsets ? 0 : insets.top;
    const bottom = ignoreBottomInsets ? 0 : insets.bottom;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const content = (
        <Animated.View style={[styles.container, style, {paddingBottom: bottom, paddingTop: top}]}>
            {Platform.OS === 'ios' && <View style={[styles.topSafeArea, {height: top}]}/>}
            {children}
        </Animated.View>
    );

    if (enableKeyboardAvoiding) {
        return (
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                {content}
            </KeyboardAvoidingView>
        );
    }

    return content;
};

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        zIndex: 1,
    },
    topSafeArea: {
        top: 0,
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.colors.background,
        zIndex: 1,
    },
});

export default SafeAreaView;