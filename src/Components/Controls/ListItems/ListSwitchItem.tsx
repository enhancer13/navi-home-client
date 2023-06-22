/* eslint-disable react/prop-types */
import React, {useEffect, useState} from "react";
import {Divider, List, Switch} from "react-native-paper";
import {ListIcon} from "./ListIcon";

declare type Props = {
    title: string;
    value: boolean;
    action: (value: boolean) => void;
    description?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    readonly?: boolean;
}

export const ListSwitchItem: React.FC<Props> = ({
                                                    title,
                                                    description,
                                                    icon,
                                                    iconColor,
                                                    iconBackgroundColor,
                                                    value,
                                                    action,
                                                    readonly}) => {
    const [isSwitchOn, setIsSwitchOn] = useState(value);

    const onSwitchChanged = () => {
        setIsSwitchOn(prevValue => {
            action(!prevValue);
            return !prevValue;
        });
    };

    useEffect(() => {
        if (isSwitchOn != value) {
            setIsSwitchOn(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={(props) => icon &&
                  <ListIcon style={props.style} icon={icon} iconColor={iconColor} iconBackgroundColor={iconBackgroundColor}/>}                right={() => <Switch value={isSwitchOn} disabled={readonly} onValueChange={onSwitchChanged}/>}
                onPress={onSwitchChanged}
            />
            <Divider/>
        </>
    )
}
