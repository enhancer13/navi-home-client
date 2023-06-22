import React from 'react';
import {StyleSheet, View} from 'react-native';
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IMotionDetectionProfile} from "../../../../../BackendTypes";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {Divider, Text, useTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {LabelTextItem} from "../../../../../Components/Controls";
import AntDesign from "react-native-vector-icons/AntDesign";

export const MotionDetectionProfile: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const motionDetectionProfile = entity as IMotionDetectionProfile;
    const theme = useTheme();

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer>
            <View style={styles.rowContainer}>
                <MaterialCommunityIcons name={'motion-sensor'} color={theme.colors.primary} style={styles.icon} size={primaryIconSize}/>
                <View style={styles.container}>
                    <Text variant={'titleMedium'} style={styles.text}>{motionDetectionProfile.motionDetectionProfileName}</Text>
                    <Divider style={styles.divider}/>
                    <LabelTextItem labelText={'Processing framerate'} valueText={motionDetectionProfile.processingFramerate}/>
                    <View style={styles.rowContainer}>
                        <LabelTextItem labelText={'Height'} valueText={motionDetectionProfile.frameHeight}/>
                        <LabelTextItem labelText={' Width'} valueText={motionDetectionProfile.frameWidth}/>
                    </View>
                    <Divider style={styles.divider}/>
                    <LabelTextItem IconComponent={AntDesign} iconName={'areachart'} labelText={'Threshold area'} valueText={motionDetectionProfile.motionThresholdArea} />
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
