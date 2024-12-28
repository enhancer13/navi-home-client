import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import _ from 'lodash';
import {Text, useTheme} from 'react-native-paper';

type AlarmDayOfWeekProps = {
    dayOfWeek: string;
    containerWidth: number;
    isActive: boolean;
}

export const AlarmDayOfWeek: React.FC<AlarmDayOfWeekProps> = ({dayOfWeek, isActive, containerWidth}) => {
    const theme = useTheme();
    const styles = createStyles(containerWidth);
    const backgroundColor = useMemo(() => isActive ? theme.colors.primary : theme.colors.surface, [isActive, theme]);
    const textColor = useMemo(() => isActive ? theme.colors.onPrimary : theme.colors.onSurface, [isActive, theme]);
    const dayOfWeekName = useMemo(() => _.startCase(dayOfWeek.substring(0, 3).toLowerCase()), [dayOfWeek]);

    return (
        <View
            style={[styles.alarmDayOfWeekContainer, {backgroundColor: backgroundColor}]}>
            <Text style={[styles.alarmDayOfWeekText, {color: textColor}]}>{dayOfWeekName}</Text>
        </View>
    );
};

// noinspection JSSuspiciousNameCombination
const createStyles = (containerWidth: number) => StyleSheet.create({
    alarmDayOfWeekContainer: {
        alignItems: 'center',
        borderRadius: containerWidth,
        height: containerWidth,
        width: containerWidth,
        justifyContent: 'center',
        marginRight: 3,
    },
    alarmDayOfWeekText: {
        fontSize: containerWidth * 0.35,
    },
});
