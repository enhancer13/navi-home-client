import React from "react";
import {Divider, List, useTheme} from "react-native-paper";

declare type Props = {
    title: string;
    description?: string;
    icon?: string;
    action: () => void;
}

export const ListActionItem: React.FC<Props> = (props) => {
    const {title, description, icon, action} = props;
    const theme = useTheme();

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={(props) => icon && <List.Icon {...props} color={theme.colors.primary} icon={icon}/>}
                onPress={action}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>)
};
