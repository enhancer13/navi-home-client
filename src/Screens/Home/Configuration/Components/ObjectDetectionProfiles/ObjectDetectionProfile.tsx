import React from 'react';
import {StyleSheet, View} from 'react-native';
import {EntityViewComponentProps} from '../../../../../Features/EntityList/EntityListScreen';
import {IObjectDetectionProfile} from '../../../../../BackendTypes';
import {EntityViewContainer} from '../../../../../Features/EntityList/EntityViewContainer';
import {Divider, Text, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LabelTextItem} from '../../../../../Components/Controls';

export const ObjectDetectionProfile: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const objectDetectionProfile = entity as IObjectDetectionProfile;
    const theme = useTheme();

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer>
            <View style={styles.rowContainer}>
                <MaterialCommunityIcons name={'human-handsdown'} color={theme.colors.primary} style={styles.icon} size={primaryIconSize}/>
                <View style={styles.container}>
                    <Text variant={'titleMedium'} style={styles.text}>{objectDetectionProfile.objectDetectionProfileName}</Text>
                    <Divider style={styles.divider}/>
                    <LabelTextItem labelText={'Processing framerate'} valueText={objectDetectionProfile.processingFramerate}/>
                    <LabelTextItem labelText={'Confidence value'} valueText={objectDetectionProfile.confidenceValue}/>
                </View>
            </View>
        </EntityViewContainer>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginVertical: 2,
    },
    bold: {
        fontWeight: 'bold',
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
        marginVertical: 5,
    },
});
