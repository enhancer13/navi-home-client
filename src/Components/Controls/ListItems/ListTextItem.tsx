/* eslint-disable react/prop-types */
import React from "react";
import {Divider, List} from "react-native-paper";
import {ListIcon} from "./ListIcon";

declare type Props = {
    value: string;
    title?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
}

export const ListTextItem: React.FC<Props> = ({
                                                  value,
                                                  title,
                                                  icon,
                                                  iconColor,
                                                  iconBackgroundColor}) => {
    return (
        <>
            <List.Item
                title={value}
                description={title}
                left={(props) => icon && <ListIcon style={props.style} icon={icon} iconColor={iconColor} iconBackgroundColor={iconBackgroundColor} />}
            />
            <Divider/>
        </>)
};
