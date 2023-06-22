import React, {ComponentType} from "react";
import {IconProps} from "react-native-vector-icons/Icon";
import {StyleSheet, View} from "react-native";
import {useTheme, Text} from "react-native-paper";

interface IconTextItemProps {
    labelText: string;
    valueText: string | number;
    iconName?: string;
    IconComponent?: ComponentType<IconProps>;
}

export const LabelTextItem: React.FC<IconTextItemProps> = ({ IconComponent, iconName, labelText, valueText }) => {
    const theme = useTheme();

    return (
        <View style={styles.rowContainer}>
            {IconComponent && iconName && <IconComponent name={iconName} color={theme.colors.primary} style={styles.icon}/>}
            <Text style={styles.text}>{labelText}: </Text>
            <Text style={[styles.text, styles.bold]}>{valueText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginVertical: 2,
    },
    bold: {
        fontWeight: 'bold'
    },
    icon: {
        marginRight: 10,
    },
});
