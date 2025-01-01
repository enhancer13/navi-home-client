/* eslint-disable react/prop-types */
import React from 'react';
import { Divider, List } from 'react-native-paper';
import { ListIcon } from './ListIcon';

declare type Props = {
    title: string;
    description?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    action: () => void;
};

export const ListActionItem: React.FC<Props> = ({ title, description, icon, iconColor, iconBackgroundColor, action }) => {
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
                title={title}
                description={description}
                left={renderLeftIcon}
                onPress={action}
            />
            <Divider />
        </>
    );
};
