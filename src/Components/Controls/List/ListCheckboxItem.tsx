import React, {useCallback, useEffect, useState} from "react";
import {Checkbox, Divider, List, useTheme} from "react-native-paper";

declare type Props = {
    title: string;
    value: boolean;
    action?: (value: boolean) => void;
    description?: string;
    icon?: string;
    readonly?: boolean;
}

export const ListCheckboxItem: React.FC<Props> = ({title, description, icon, value, action, readonly}) => {
    const [isCheckedOn, setIsCheckedOn] = useState(value);
    const theme = useTheme();

    const handleCheckboxChanged = useCallback(() => {
        setIsCheckedOn(prevState => !prevState);
    }, []);

    useEffect(() => {
        if (isCheckedOn != value) {
            setIsCheckedOn(value);
        }
    }, [value])

    useEffect(() => {
        if (isCheckedOn != value) {
            action && action(isCheckedOn);
        }
    }, [isCheckedOn])

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={props => icon && <List.Icon {...props} color={theme.colors.primary} icon={icon}/>}
                right={() => <Checkbox status={isCheckedOn ? 'checked' : 'unchecked'} disabled={readonly} onPress={handleCheckboxChanged}/>}
                onPress={handleCheckboxChanged}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>
    )
}
