import React, {ComponentType} from "react";
import {IconProps} from "react-native-vector-icons/Icon";
import {StyleSheet, View} from "react-native";
import {Checkbox, useTheme} from "react-native-paper";

interface IconCheckboxItemProps {
    label: string;
    checked: boolean;
    IconComponent?: ComponentType<IconProps>;
    iconName?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
}


export const LabelCheckboxItem: React.FC<IconCheckboxItemProps> = ({
                                                                       IconComponent,
                                                                       iconName,
                                                                       label,
                                                                       checked,
                                                                       iconBackgroundColor,
                                                                       iconColor
                                                                   }) => {
    const theme = useTheme();

    return (
        <View style={styles.rowContainer}>
            {IconComponent && iconName && <IconComponent name={iconName} color={iconColor ?? theme.colors.primary} style={[styles.icon, {backgroundColor: iconBackgroundColor}]}/>}
            <Checkbox.Item label={`${label}:`} labelVariant='labelLarge' style={styles.checkboxItem} status={checked ? 'checked' : 'unchecked'}/>
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
