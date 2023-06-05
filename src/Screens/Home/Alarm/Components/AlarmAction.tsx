import React from "react";
import {StyleSheet, View} from "react-native";
import {AlarmActions} from "../../../../BackendTypes";
import {useTheme} from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";

const AlarmActionIcons = Object.freeze({
    SAVE_LOG: {
        getIcon: (iconColor: string, size: number) => (
            <FontAwesome name="pencil-square-o" color={iconColor} size={size} />
        ),
    },
    SAVE_IMAGE: {
        getIcon: (iconColor: string, size: number) => <Entypo name="images" color={iconColor} size={size} />,
    },
    SEND_EMAIL: {
        getIcon: (iconColor: string, size: number) => <Fontisto name="email" color={iconColor} size={size} />,
    },
    RECORD_VIDEO: {
        getIcon: (iconColor: string, size: number) => (
            <Ionicons name="recording" color={iconColor} size={size} />
        ),
    },
    NOTIFICATION: {
        getIcon: (iconColor: string, size: number) => (
            <Ionicons name="notifications" color={iconColor} size={size} />
        ),
    },
});

type AlarmActionProps = {
    alarmAction: keyof typeof AlarmActions;
    containerWidth: number;
    isActive: boolean;
}

export const AlarmAction: React.FC<AlarmActionProps> = ({alarmAction, isActive, containerWidth}) => {
    const theme = useTheme();
    const iconColor = isActive ? theme.colors.primary : theme.colors.onSurfaceVariant;

    return (
        <View style={styles.alarmActionContainer}>
            {AlarmActionIcons[alarmAction].getIcon(iconColor, containerWidth)}
        </View>
    );
}

const styles = StyleSheet.create({
    alarmActionContainer: {
        alignItems: 'center',
        marginRight: 8,
    }
});
