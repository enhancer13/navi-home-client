import {IMediaGalleryFile} from "../../../../../../BackendTypes";
import {httpClient} from "../../../../../../Framework/Net/HttpClient/HttpClient";
import {backendEndpoints} from "../../../../../../Config/BackendEndpoints";
import {IEntityDataManager} from "../../../../../../Framework/Data/DataManager/IEntityDataManager";
import {useAuth} from "../../../../../../Features/Authentication";
import {Share, ShareContent} from "react-native";
import React from "react";

export const useMediaFileActions = (currentMediaFile: IMediaGalleryFile | null, setCurrentMediaFile: React.Dispatch<React.SetStateAction<IMediaGalleryFile | null>>, mediaFileDataManager: IEntityDataManager<IMediaGalleryFile>) => {
    const {authentication} = useAuth();

    const onDownload = async () => {
        //TODO
    };

    const onDelete = async () => {
        if (!currentMediaFile) {
            return;
        }

        try {
            await mediaFileDataManager.deleteSingle(currentMediaFile);
            setCurrentMediaFile(null);
        } catch (error) {
            console.error(error);
        }
    };

    const onShare = async () => {
        if (!currentMediaFile) {
            return;
        }

        const limitedAccessLink : string = await httpClient.get(backendEndpoints.MediaGallery.LIMITED_ACCESS_LINK(currentMediaFile), {
            authentication,
            headers: {Accept: 'text/plain'}
        });

        const shareOptions : ShareContent = {
            title: `Sharing ${currentMediaFile.fileName}`,
            message: limitedAccessLink,
            url: ''
        };
        try {
            await Share.share(shareOptions);
        } catch (error) {
            console.error(error)
        }
    };

    return {onShare, onDelete, onDownload}
}



