import React, {useState, useEffect} from 'react';
import Moment, { Moment as MomentTypes } from 'moment';
import {Divider, IconButton, List, useTheme} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {applicationConstants} from "../../../Config/ApplicationConstants";

declare type Props = {
    title: string;
    mode: 'date' | 'time' | 'datetime';
    value: string | undefined | null;
    readonly: boolean;
    onChange: (value: string | null) => void;
};

export const ListDateTimePicker: React.FC<Props> = ({title, mode, value, readonly, onChange}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [momentValue, setMomentValue] = useState<MomentTypes | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (value) {
            const momentVal = Moment(value, applicationConstants.Formats[mode]);
            setMomentValue(momentVal);
        } else {
            setMomentValue(null);
        }
    }, [value, mode]);

    const onDateTimeChange = (value: Date) => {
        setShowPicker(false);
        if (value) {
            const momentVal = Moment(value);
            if (!momentVal.isSame(momentValue)) {
                onChange(momentVal.format(applicationConstants.Formats[mode]));
            }
        }
    };

    const labeledInputIconName = mode === 'time' ? 'clock-time-nine-outline' : 'calendar';
    const iconColor = theme.colors.primary;

    return (
        <>
            <List.Item
                title={momentValue ? momentValue.format(applicationConstants.Formats[mode]) : ''}
                description={title}
                right={() =>
                    <>
                        <IconButton icon="delete-outline" iconColor={iconColor} onPress={() => onChange(null)}/>
                        <IconButton icon={labeledInputIconName} iconColor={iconColor} onPress={() => setShowPicker(true)}/>
                    </>
                }
            />
            {!readonly &&
              <DatePicker
                modal
                mode={mode}
                open={showPicker}
                date={momentValue ? momentValue.toDate() : new Date()}
                onConfirm={date => {
                    setShowPicker(false);
                    onDateTimeChange(date);
                }}
                onCancel={() => setShowPicker(false)}
              />
            }
            <Divider/>
        </>
    );
}
