import {Animated, Pressable, StyleSheet, View} from 'react-native';
import React, {useMemo, useRef} from 'react';
import {ScaleAnimation} from "../../../../Animations";
import {MD3Theme as Theme, useTheme} from "react-native-paper";
import color from "color";

const itemMargin = 1;
const itemPadding = 3;

declare type Props = {
    content: ((props: { width: number; }) => React.ReactNode);
    selected: boolean;
    width: number;
    onPress: () => void;
    onLongPress: () => void;
}

const SelectableItem: React.FC<Props> = (props) => {
    const {content, selected, width, onPress, onLongPress} = props;
    const scaleAnimation = useRef(new ScaleAnimation());
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const contentWidth = useMemo(() => width - 2 * (itemMargin + itemPadding), [width]);
    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => scaleAnimation.current.startScaleInAnimation()}
            onPressOut={() => scaleAnimation.current.startScaleOutAnimation()}
            onLongPress={onLongPress}
            style={[
                {width: width - 2 * itemMargin},
                styles.container,
                selected ? styles.selected : null,
            ]}>
            <Animated.View style={[styles.container, scaleAnimation.current.getStyle()]}>
                {content({ width: contentWidth })}
            </Animated.View>
        </Pressable>
    );
}

export default SelectableItem;

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        margin: itemMargin,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        backgroundColor: theme.dark ? theme.colors.primary : color(theme.colors.primary).lighten(0.45).hex(),
        opacity: 0.9,
        zIndex: 0,
    },
    statusLabel: {
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 1,
    },
});
