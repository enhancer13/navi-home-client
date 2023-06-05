import React, {useCallback} from 'react';
import {MediaFolder} from './Components/MediaFolder';
import {getDeviceTypeSync, isTablet} from 'react-native-device-info';
import {EntityListScreen} from '../../../Features/EntityList/EntityListScreen';
import {useNavigation} from "@react-navigation/native";
import {ListItem} from "../../../Features/EntityList/ListItem";
import {EntityNames, IMediaGalleryFolder} from "../../../BackendTypes";
import {GalleryNavigationProp} from "./index";

const columnCount = (isTablet() || getDeviceTypeSync() === 'Desktop') ? 5 : 3;

export const MediaFolderViewer: React.FC = () => {
    const navigation = useNavigation<GalleryNavigationProp>();

    const onMediaFolderPress = useCallback((listItem: ListItem) => {
        navigation.navigate('Media File Viewer', {folder: listItem.getEntity() as IMediaGalleryFolder});
    }, [navigation]);

    return (
        <EntityListScreen
            entityName={EntityNames.MediaGalleryFolder}
            EntityViewComponent={MediaFolder}
            columnCount={columnCount}
            backButton={false}
            onItemPress={onMediaFolderPress}
        />
    );
}
