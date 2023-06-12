import React, {useCallback, useMemo, useState} from "react";
import {Animated, ListRenderItem, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {List, Surface, Text, useTheme} from "react-native-paper";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";

const AnimatedText = Animated.createAnimatedComponent(Text);

export declare type SectionListProps = {
    title: string;
    sections: ISection[];
    containerStyle?: StyleProp<ViewStyle> | undefined;
    titleHeight?: number;
    onScroll?: | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
}

export interface ISection {
    key?: string;
    title?: string;
    items: Array<React.ReactElement>;
}

export const AnimatedSectionList: React.FC<SectionListProps> = ({
                                                                    title,
                                                                    containerStyle,
                                                                    titleHeight = hp(10),
                                                                    sections,
                                                                    onScroll
                                                                }) => {
    const [scrollY] = useState(new Animated.Value(0));
    const theme = useTheme();

    const titleTranslate = scrollY.interpolate({
        inputRange: [0, titleHeight],
        outputRange: [0, -titleHeight],
        extrapolate: 'clamp',
    });

    const titleHeightAnimatedValue = scrollY.interpolate({
        inputRange: [0, titleHeight],
        outputRange: [titleHeight, 0],
        extrapolate: 'clamp',
    });

    const titleTextColor = scrollY.interpolate({
        inputRange: [0, titleHeight],
        outputRange: [theme.colors.primary, 'transparent'],
        extrapolate: 'clamp',
    });

    const titleTextSize = scrollY.interpolate({
        inputRange: [0, titleHeight],
        outputRange: [titleHeight * 0.5, 0],
        extrapolate: 'clamp',
    });

    const sectionsWithKeys = useMemo(() => {
        return sections.map((section, sectionIndex) => {
            const itemsWithKeys = section.items.map((item, index) => {
                return React.cloneElement(item, {key: sectionIndex + '-' + index});
            });
            return {...section, items: itemsWithKeys};
        });
    }, [sections]);

    const renderSection: ListRenderItem<ISection> = useCallback((renderItemInfo) => {
        const section = renderItemInfo.item;
        return (
            <Surface style={styles.section} elevation={2}>
                {section.title && <List.Subheader>{section.title}</List.Subheader>}
                {section.items}
            </Surface>
        )
    }, []);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollY.setValue(event.nativeEvent.contentOffset.y);
        onScroll && onScroll(event);
    }, [onScroll]);

    return (
        <View style={[containerStyle, {height: '100%', width: '100%'}]}>
            <View style={{backgroundColor: theme.colors.background, height: '100%', width: '100%'}}>
                <Animated.View style={[styles.title, {
                    transform: [{translateY: titleTranslate}],
                    height: titleHeightAnimatedValue,
                }]}>
                    <AnimatedText style={{fontSize: titleTextSize, color: titleTextColor}}>{title}</AnimatedText>
                </Animated.View>
                <Animated.FlatList
                    contentContainerStyle={{paddingTop: titleHeight, paddingBottom: titleHeight * 2}}
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    data={sectionsWithKeys}
                    keyExtractor={(item, index) => (item.title ?? '') + index}
                    renderItem={renderSection}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    section: {
        borderRadius: 10,
        margin: 10,
        padding: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        elevation: 4,
    },
});

