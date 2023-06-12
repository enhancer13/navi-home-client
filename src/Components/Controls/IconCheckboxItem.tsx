import React, {ComponentType} from "react";
import {IconProps} from "react-native-vector-icons/Icon";
import {StyleSheet, View} from "react-native";
import {Checkbox, useTheme} from "react-native-paper";

interface IconCheckboxItemProps {
    IconComponent: ComponentType<IconProps>;
    iconName: string;
    label: string;
    status: 'checked' | 'unchecked';
}


export const IconCheckboxItem: React.FC<IconCheckboxItemProps> = ({ IconComponent, iconName, label, status }) => {
    const theme = useTheme();

    return (
        <View style={styles.rowContainer}>
            <IconComponent name={iconName} color={theme.colors.primary} style={styles.icon}/>
            <Checkbox.Item label={`${label}:`} labelVariant='labelLarge' style={styles.checkboxItem} status={status}/>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxItem: {
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    icon: {
        marginRight: 10,
    },
});
