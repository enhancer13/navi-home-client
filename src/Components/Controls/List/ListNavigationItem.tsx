import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Divider, List, useTheme} from "react-native-paper";

declare type Props = {
    key: number;
    title: string;
    description?: string;
    icon?: string;
    route: string;
}

export const ListNavigationItem: React.FC<Props> = (props) => {
    const navigation = useNavigation();
    const {title, description, icon, route} = props;
    const theme = useTheme();

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={(props) => icon && <List.Icon {...props} color={theme.colors.primary} icon={icon}/>}
                onPress={() => navigation.navigate(route as never)}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>)
};
