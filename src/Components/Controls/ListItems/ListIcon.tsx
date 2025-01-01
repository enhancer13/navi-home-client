import {List, useTheme} from 'react-native-paper';
import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {AppTheme} from '../../../AppTheme';

export type ListIconProps = {
    icon: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    style?: StyleProp<ViewStyle>
}

export const ListIcon: React.FC<ListIconProps> = ({
                                                      icon,
                                                      iconColor,
                                                      iconBackgroundColor,
                                                      style,
                                                  }) => {
    const theme = useTheme<AppTheme>();
    return <List.Icon color={iconColor ?? theme.colors.system.white}
                      style={[style, styles.icon, {backgroundColor: iconBackgroundColor}]}
                      icon={icon}/>;
};

const styles = StyleSheet.create({
    icon: {
        borderRadius: 5,
        padding: 2,
    },
});
