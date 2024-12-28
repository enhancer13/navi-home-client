/* eslint-disable react/prop-types */
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { List, Divider } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { ListIcon } from './ListIcon';
import color from 'color';

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
            // @ts-ignore
            navigation.navigate(route, routeParams);
        } else {
            navigation.navigate(route as never);
        }
    }, [navigation, route, routeParams]);

    const renderLeftIcon = (props: any) => {
        if (icon) {
            return (
                <ListIcon
                    style={props.style}
                    icon={icon}
                    iconColor={iconColor}
                    iconBackgroundColor={iconBackgroundColor}
                />
            );
        }
        return null;
    };

    const renderRightIcon = (props: any) => (
        <ListIcon
            style={props.style}
            icon={'chevron-right'}
            iconColor={color(props.color).fade(0.8).toString()}
        />
    );

    return (
        <>
            <List.Item
                title={title}
                description={description}
                left={renderLeftIcon}
                right={renderRightIcon}
                onPress={navigate}
            />
            <Divider />
        </>
    );
}
