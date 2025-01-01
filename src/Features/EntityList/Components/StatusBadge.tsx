import * as React from 'react';
import {Badge, useTheme} from 'react-native-paper';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {AppTheme} from '../../../AppTheme';

declare type StatusBadgeProps = {
    status: 'new' | 'modified' | null;
    style?: StyleProp<TextStyle> | undefined;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
    const theme = useTheme<AppTheme>();
    const {information, warning, white} = theme.colors.system;

    return (
        status && <Badge style={[style, {color: white, backgroundColor: status === 'new' ? information : warning}]}>{status}</Badge>
    );
};
