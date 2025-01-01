import {IMediaSource} from '../../../IMediaSource';
import {IMediaStatus} from '../../../IMediaStatus';
import {useEffect, useRef, useState} from 'react';
import { Image } from 'react-native';

export const useLoadMedia = (mediaSources: IMediaSource[]) => {
    const [mediaStatuses, setMediaStatuses] = useState<IMediaStatus[]>([]);
    const loadedIndexes = useRef(new Map<number, boolean>());
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setInitialized(false);
        setMediaStatuses(mediaSources.map(() => ({status: 'loading', width: 0, height: 0})));
        loadedIndexes.current = new Map<number, boolean>();
    }, [mediaSources]);

    useEffect(() => {
        if (!initialized && mediaStatuses.length !== 0 && mediaStatuses.length === mediaSources.length) {
            setInitialized(true);
        }
    }, [mediaStatuses]);

    const saveStatus = (index: number, mediaStatus: IMediaStatus) => {
        if (mediaStatuses[index] && mediaStatuses[index].status !== 'loading') {
            return;
        }

        setMediaStatuses(prevMediaStatuses => {
            const newMediaStatuses = [...prevMediaStatuses];
            newMediaStatuses[index] = mediaStatus;
            return newMediaStatuses;
        });
    };

    const loadMedia =  (index: number) => {
        if (loadedIndexes.current.has(index) || index >= mediaSources.length) {
            return;
        }

        loadedIndexes.current.set(index, true);
        const mediaSource = mediaSources[index];
        const mediaStatus = {...mediaStatuses[index]};

        if (mediaSource.mediaType === 'VIDEO' || mediaStatus.status === 'success' || (mediaStatus.width > 0 && mediaStatus.height > 0)) {
            mediaStatus.status = 'success';
            mediaStatus.height = mediaSource.height || 0;
            mediaStatus.width = mediaSource.width || 0;
            saveStatus(index, mediaStatus);
        } else if (!mediaSource.url || mediaSource.url.startsWith('file:') || (mediaSource.width && mediaSource.height)) {
            mediaStatus.width = mediaSource.width || 0;
            mediaStatus.height = mediaSource.height || 0;
            mediaStatus.status = 'success';
            saveStatus(index, mediaStatus);
        } else {
            Image.getSize(
                mediaSource.url,
                (width: number, height: number) => {
                    mediaStatus.width = width;
                    mediaStatus.height = height;
                    mediaStatus.status = 'success';
                    saveStatus(index, mediaStatus);
                },
                () => {
                    try {
                        const data = (Image as any).resolveAssetSource(mediaSource.props.source);
                        mediaStatus.width = data.width;
                        mediaStatus.height = data.height;
                        mediaStatus.status = 'success';
                        saveStatus(index, mediaStatus);
                    } catch (newError) {
                        mediaStatus.status = 'fail';
                    }
                },
            );
        }
    };

    return {initialized, mediaStatuses, loadMedia};
};
