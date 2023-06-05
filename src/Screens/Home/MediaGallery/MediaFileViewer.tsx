import React, {useCallback, useEffect, useState} from 'react';
import {getDeviceTypeSync, isTablet} from 'react-native-device-info';
import {MediaFile} from './Components/MediaFile';
import {ModalMediaFileViewer} from './Components/ModalMediaFileViewer/ModalMediaFileViewer';
import {EntityNames, IMediaGalleryFile, IMediaGalleryFolder} from "../../../BackendTypes";
import {EntityListScreen} from "../../../Features/EntityList/EntityListScreen";
import {ListItem} from "../../../Features/EntityList/ListItem";
import {useEntityDataManager} from "../../../Features/DataManager/useEntityDataManager";
import {useModalMediaFileViewer} from "./Hooks/useModalMediaFileViewer";
import {useRoute} from "@react-navigation/native";
import {GalleryRouteProps} from "./index";

const columnCount = (isTablet() || getDeviceTypeSync() === 'Desktop') ? 5 : 3;

export const MediaFileViewer: React.FC = () => {
    const [mediaFolder, setMediaFolder] = useState<IMediaGalleryFolder>();
    const mediaFolderDataManager = useEntityDataManager<IMediaGalleryFolder>(EntityNames.MediaGalleryFolder);
    const mediaFileDataManager = useEntityDataManager<IMediaGalleryFile>(EntityNames.MediaGalleryFile);
    const {mediaViewerVisible, currentMediaFile, openViewer, closeViewer} = useModalMediaFileViewer();
    const route = useRoute<GalleryRouteProps<'Media File Viewer'>>()

    const onMediaFilePress = useCallback((listItem: ListItem) => {
        const mediaFile = listItem.getEntity() as IMediaGalleryFile;
        openViewer(mediaFile);
    }, []);

    useEffect(() => {
        setMediaFolder(route.params.folder);
    }, [route]);

    if (!(mediaFolder && mediaFolderDataManager && mediaFileDataManager)) {
        return null;
    }

    const parentEntityRestriction = {entity: mediaFolder, entityDefinition: mediaFolderDataManager.entityDefinition};

    return (
        <>
            {mediaViewerVisible && currentMediaFile &&
              <ModalMediaFileViewer
                visible={mediaViewerVisible}
                parentEntityRestriction={parentEntityRestriction}
                mediaFileDataManager={mediaFileDataManager}
                initialMediaFile={currentMediaFile}
                onRequestClose={closeViewer}
              />}
            <EntityListScreen
                entityName={EntityNames.MediaGalleryFile}
                EntityViewComponent={MediaFile}
                columnCount={columnCount}
                backButton={true}
                onItemPress={onMediaFilePress}
                parentEntityRestriction={parentEntityRestriction}
            />
        </>

    );
}
