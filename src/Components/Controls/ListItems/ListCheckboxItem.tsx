/* eslint-disable react/prop-types */
import React, {useCallback, useEffect, useState} from "react";
import {Checkbox, Divider, List} from "react-native-paper";
import {ListIcon} from "./ListIcon";

declare type Props = {
    title: string;
    value: boolean;
    action?: (value: boolean) => void;
    description?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    readonly?: boolean;
}

export const ListCheckboxItem: React.FC<Props> = ({
                                                      title,
                                                      description,
                                                      icon,
                                                      iconColor,
                                                      iconBackgroundColor,
                                                      value,
                                                      action,
                                                      readonly
                                                  }) => {
    const [isCheckedOn, setIsCheckedOn] = useState(value);

    const handleCheckboxChanged = useCallback(() => {
        setIsCheckedOn(prevState => {
            const newValue = !prevState;
            if (newValue !== value) {
                action && action(newValue);
            }
            return newValue;
        });
    }, [value, action]);

    useEffect(() => {
        if (value !== isCheckedOn) {
            setIsCheckedOn(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={(props) => icon && <ListIcon style={props.style} icon={icon} iconColor={iconColor}
                                                   iconBackgroundColor={iconBackgroundColor}/>}
                right={() => <Checkbox status={isCheckedOn ? 'checked' : 'unchecked'} disabled={readonly}
                                       onPress={handleCheckboxChanged}/>}
                onPress={handleCheckboxChanged}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>
    )
}
