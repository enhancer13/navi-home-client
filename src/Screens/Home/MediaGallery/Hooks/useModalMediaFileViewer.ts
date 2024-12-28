import {useCallback, useEffect, useState} from 'react';
import {IMediaGalleryFile} from '../../../../BackendTypes';

export const useModalMediaFileViewer = () => {
    const [visible, setVisible] = useState(false);
    const [currentMediaFile, setCurrentMediaFile] = useState<IMediaGalleryFile | null>(null);

    const openViewer = useCallback((mediaGalleryFile: IMediaGalleryFile) => {
        setCurrentMediaFile(mediaGalleryFile);
    }, []);

    const closeViewer =  useCallback(() => {
        setCurrentMediaFile(null);
    }, []);

    useEffect(() => {
        setVisible(currentMediaFile !== null);
    }, [currentMediaFile]);

    return {mediaViewerVisible: visible, currentMediaFile, openViewer, closeViewer};
};
