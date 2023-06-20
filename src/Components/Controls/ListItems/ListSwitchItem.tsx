import React, {useEffect, useState} from "react";
import {Divider, List, Switch, useTheme} from "react-native-paper";

declare type Props = {
    title: string;
    value: boolean;
    action: (value: boolean) => void;
    description?: string;
    icon?: string;
    iconColor?: string;
    readonly?: boolean;
}

export const ListSwitchItem: React.FC<Props> = ({title, description, icon, iconColor, value, action, readonly}) => {
    const [isSwitchOn, setIsSwitchOn] = useState(value);
    const theme = useTheme();

    const onSwitchChanged = () => {
        setIsSwitchOn(prevState => !prevState);
    };

    useEffect(() => {
        if (isSwitchOn != value) {
            setIsSwitchOn(value);
        }
    }, [value])

    useEffect(() => {
        if (isSwitchOn != value) {
            action(isSwitchOn);
        }
    }, [isSwitchOn])

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={props => icon && <List.Icon {...props} color={iconColor ?? theme.colors.primary} icon={icon}/>}
                right={() => <Switch value={isSwitchOn} disabled={readonly} onValueChange={onSwitchChanged}/>}
                onPress={onSwitchChanged}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>
    )
}
