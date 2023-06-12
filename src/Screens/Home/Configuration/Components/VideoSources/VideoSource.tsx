import React from 'react';
import {StyleSheet, View} from 'react-native';
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IVideoSource} from "../../../../../BackendTypes";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {Divider, Text, useTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import {IconCheckboxItem, IconTextItem} from "../../../../../Components/Controls";

export const VideoSource: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const videoSource = entity as IVideoSource;
    const theme = useTheme();

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer
            content={
                <View style={styles.rowContainer}>
                    <Entypo name={'video-camera'} color={theme.colors.primary} style={styles.icon} size={primaryIconSize}/>
                    <View style={styles.container}>
                        <Text variant={'titleMedium'} style={styles.text}>{videoSource.cameraName}</Text>
                        <Divider style={styles.divider}/>
                        <View style={styles.rowContainer}>
                            <IconTextItem labelText={'Height'} valueText={videoSource.frameHeight}/>
                            <IconTextItem labelText={' Width'} valueText={videoSource.frameWidth}/>
                        </View>
                        <IconTextItem labelText={'Input Frames Frequency'} valueText={videoSource.framesFrequency}/>
                        <Divider style={styles.divider}/>
                        <View style={styles.rowContainer}>
                            <IconCheckboxItem iconName={'video-wireless'} IconComponent={MaterialCommunityIcons}
                                              label="Streaming"
                                              status={videoSource.videoStreamingAllowed ? 'checked' : 'unchecked'}/>
                            <IconCheckboxItem iconName={'recording'} IconComponent={Ionicon} label="Recording"
                                              status={videoSource.videoRecordingAllowed ? 'checked' : 'unchecked'}/>
                        </View>
                    </View>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginVertical: 2,
    },
    bold: {
        fontWeight: 'bold'
    },
    checkboxItem: {
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    container: {
        flexGrow: 1,
    },
    icon: {
        marginRight: 10,
    },
    divider: {
        marginVertical: 5
    }
});
