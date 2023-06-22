import React from 'react';
import {StyleSheet, View} from 'react-native';
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IVideoStreamingProfile} from "../../../../../BackendTypes";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {Divider, Text, useTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import {LabelCheckboxItem, LabelTextItem} from "../../../../../Components/Controls";

export const VideoStreamingProfile: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const videoStreamingProfile = entity as IVideoStreamingProfile;
    const theme = useTheme();

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer>
            <View style={styles.rowContainer}>
                <MaterialCommunityIcons name={'video-wireless'} color={theme.colors.primary} style={styles.icon} size={primaryIconSize}/>
                <View style={styles.container}>
                    <Text variant={'titleMedium'} style={styles.text}>{videoStreamingProfile.videoStreamingProfileName}</Text>
                    <Divider style={styles.divider}/>
                    <LabelTextItem labelText={'Processing framerate'} valueText={videoStreamingProfile.processingFramerate}/>
                    <View style={styles.rowContainer}>
                        <LabelTextItem labelText={'Height'} valueText={videoStreamingProfile.videoFrameHeight}/>
                        <LabelTextItem labelText={' Width'} valueText={videoStreamingProfile.videoFrameWidth}/>
                    </View>
                    <Divider style={styles.divider}/>
                    <LabelTextItem IconComponent={FontAwesome} iconName={'calculator'} labelText={'Video codec'} valueText={videoStreamingProfile.videoCodec} />
                    <LabelCheckboxItem iconName={'cpu'} IconComponent={Feather} label="Hardware acceleration"
                                       checked={videoStreamingProfile.videoEncodingHardwareAcceleration}/>
                </View>
            </View>
        </EntityViewContainer>
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
