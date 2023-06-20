import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useMemo} from 'react';
import {EntityViewComponentProps} from "../../../../Features/EntityList/EntityListScreen";
import {IMediaGalleryFolder} from "../../../../BackendTypes";
import {useTheme, Text} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";

const mediaFolderPropsAreEqual = (prevProps: EntityViewComponentProps, nextProps: EntityViewComponentProps): boolean => {
    const prevEntity = prevProps.entity as IMediaGalleryFolder;
    const nextEntity = nextProps.entity as IMediaGalleryFolder;

    return (
        prevProps.width === nextProps.width &&
        prevProps.entity.id === nextProps.entity.id &&
        prevEntity.folderName === nextEntity.folderName &&
        prevEntity.folderPath === nextEntity.folderPath &&
        prevEntity.countImages === nextEntity.countImages &&
        prevEntity.countVideos === nextEntity.countVideos
    );
};

// eslint-disable-next-line react/prop-types
export const MediaFolder: React.FC<EntityViewComponentProps> = React.memo(({entity, width}) => {
    const mediaFolder = entity as IMediaGalleryFolder;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    // noinspection JSSuspiciousNameCombination
    return (
        <View style={{height: width, width: width}}>
            <FastImage source={require('./Resources/folder_icon.png')} style={styles.folder}/>
            <View style={styles.leftIconContainer}>
                <FastImage source={require('./Resources/folder_image.png')} style={styles.icon}/>
                <Text style={styles.iconText}>{mediaFolder.countImages}</Text>
            </View>
            <View style={styles.rightIconContainer}>
                <FastImage source={require('./Resources/folder_video.png')} style={styles.icon}/>
                <Text style={styles.iconText}>{mediaFolder.countVideos}</Text>
            </View>
            <Text style={styles.folderName}>{mediaFolder.folderName}</Text>
        </View>
    );
}, mediaFolderPropsAreEqual);

MediaFolder.displayName = 'MediaFolder';

const createStyles = (theme: Theme) => StyleSheet.create({
    folder: {
        height: '79%', //folder icon size 630*500
        resizeMode: 'contain',
        width: '100%',
        opacity: 0.7,
    },
    folderName: {
        alignSelf: 'flex-start',
        color: theme.colors.onBackground,
        marginLeft: 5,
    },
    icon: {
        height: '100%',
        width: '100%',
    },
    iconText: {
        alignSelf: 'center',
        color: theme.colors.onPrimary,
    },
    leftIconContainer: {
        height: '26%',
        left: '10%',
        position: 'absolute',
        top: '25%',
        width: '26%',
    },
    rightIconContainer: {
        height: '26%',
        position: 'absolute',
        right: '10%',
        top: '25%',
        width: '26%',
    }
});
