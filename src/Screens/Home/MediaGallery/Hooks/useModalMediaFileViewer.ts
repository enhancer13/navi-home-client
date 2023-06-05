import {useEffect, useState} from "react";
import {IMediaGalleryFile} from "../../../../BackendTypes";

export const useModalMediaFileViewer = () => {
    const [visible, setVisible] = useState(false);
    const [currentMediaFile, setCurrentMediaFile] = useState<IMediaGalleryFile | null>(null);
    const openViewer = (mediaGalleryFile: IMediaGalleryFile) => {
        setCurrentMediaFile(mediaGalleryFile);
    };

    const closeViewer = () => {
        setCurrentMediaFile(null);
    }

    useEffect(() => {
        setVisible(currentMediaFile !== null)
    }, [currentMediaFile]);


    return {mediaViewerVisible: visible, currentMediaFile, openViewer, closeViewer};
}
