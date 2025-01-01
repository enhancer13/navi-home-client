/* eslint-disable react/prop-types */
import React from 'react';
import { Divider, List } from 'react-native-paper';
import { ListIcon } from './ListIcon';

declare type Props = {
    value: string;
    title?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
};

export const ListTextItem: React.FC<Props> = ({
                                                  value,
                                                  title,
                                                  icon,
                                                  iconColor,
                                                  iconBackgroundColor,
                                              }) => {
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

    return (
        <>
            <List.Item
                title={value}
                description={title}
                left={renderLeftIcon}
            />
            <Divider />
        </>
    );
};
