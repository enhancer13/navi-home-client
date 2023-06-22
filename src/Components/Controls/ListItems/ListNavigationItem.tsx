/* eslint-disable react/prop-types */
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {List, Divider} from "react-native-paper";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useCallback} from "react";
import {ListIcon} from "./ListIcon";

type ListNavigationItemProps<ParamList extends ParamListBase, RouteName extends keyof ParamList = string> = {
    title: string;
    description?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    route: RouteName;
    routeParams?: ParamList[RouteName];
};

export function ListNavigationItem<ParamList extends ParamListBase, RouteName extends keyof ParamList = string>({
                                                                                                                    title,
                                                                                                                    description,
                                                                                                                    icon,
                                                                                                                    iconColor,
                                                                                                                    iconBackgroundColor,
                                                                                                                    route,
                                                                                                                    routeParams,
                                                                                                                }: ListNavigationItemProps<ParamList, RouteName>) {
    const navigation = useNavigation<NativeStackNavigationProp<ParamList, RouteName>>();

    const navigate = useCallback(() => {
        if (routeParams !== undefined) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate(route, routeParams);
        } else {
            navigation.navigate(route as never);
        }
    }, [navigation, route, routeParams]);

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={(props) => icon && <ListIcon style={props.style} icon={icon} iconColor={iconColor}
                                                   iconBackgroundColor={iconBackgroundColor}/>}                onPress={navigate}
                rippleColor="rgba(135,105,255,0.2)"
            />
            <Divider/>
        </>
    );
}
