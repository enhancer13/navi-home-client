import React, { useState, useEffect } from 'react';
import Moment, { Moment as MomentTypes } from 'moment';
import { Divider, IconButton, List, useTheme } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { applicationConstants } from '../../../Config/ApplicationConstants';
import { backendConstants } from '../../../Config/BackendConstants';

declare type Props = {
    title: string;
    mode: 'date' | 'time' | 'datetime';
    value: string | undefined | null;
    readonly: boolean;
    onChange: (value: string | null) => void;
};

export const ListDateTimePicker: React.FC<Props> = ({ title, mode, value, readonly, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [momentValue, setMomentValue] = useState<MomentTypes | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (value) {
            const momentVal = Moment(value, backendConstants.Formats[mode]);
            setMomentValue(momentVal);
        } else {
            setMomentValue(null);
        }
    }, [value, mode]);

    const onDateTimeChange = (value: Date) => {
        setShowPicker(false);
        if (value) {
            const newMomentValue = Moment(value);
            newMomentValue.seconds(0); // react-native-date-picker doesn't allow to edit seconds
            if (!newMomentValue.isSame(momentValue)) {
                onChange(newMomentValue.format(backendConstants.Formats[mode]));
            }
        }
    };

    const renderRightIcons = () => {
        const labeledInputIconName = mode === 'time' ? 'clock-time-nine-outline' : 'calendar';
        const iconColor = theme.colors.primary;

        return (
            <>
                <IconButton icon="delete-outline" iconColor={iconColor} onPress={() => onChange(null)} />
                <IconButton icon={labeledInputIconName} iconColor={iconColor} onPress={() => setShowPicker(true)} />
            </>
        );
    };

    return (
        <>
            <List.Item
                title={momentValue ? momentValue.format(applicationConstants.Formats[mode]) : ''}
                description={title}
                right={renderRightIcons}
            />
            {!readonly && (
                <DatePicker
                    theme={theme.dark ? 'dark' : 'light'}
                    modal
                    mode={mode}
                    open={showPicker}
                    date={momentValue ? momentValue.toDate() : new Date()}
                    onConfirm={(date) => {
                        setShowPicker(false);
                        onDateTimeChange(date);
                    }}
                    onCancel={() => setShowPicker(false)}
                />
            )}
            <Divider />
        </>
    );
};
