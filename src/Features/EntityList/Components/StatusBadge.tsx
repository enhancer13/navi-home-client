import * as React from 'react';
import {Badge, useTheme} from 'react-native-paper';
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {TextStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import {NaviTheme} from "../../../../PaperTheme";

declare type StatusBadgeProps = {
    status: 'new' | 'modified' | null;
    style?: StyleProp<TextStyle> | undefined;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
    const theme = useTheme<NaviTheme>();
    const {information, warning, onStatusBadge} = theme.colors.statusBadge;

    return (
        status && <Badge style={[style, {color: onStatusBadge, backgroundColor: status === 'new' ? information : warning}]}>{status}</Badge>
    );
}
