import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {backendEndpoints} from '../../../../../Config/BackendEndpoints';
import {heightPercentageToDP as hp,} from 'react-native-responsive-screen';
import {MediaViewer} from '../../../../../Features/MediaViewer/MediaViewer';
import {useAuth} from "../../../../../Features/Authentication";
import {IconButton, useTheme} from "react-native-paper";
import {
    ParentEntityRestriction,
    useVolatileEntityCollection
} from "../../../../../Features/EntityList/Hooks/useVolatileEntityCollection";
import {IEntityDataManager} from "../../../../../Framework/Data/DataManager/IEntityDataManager";
import {IMediaGalleryFile} from "../../../../../BackendTypes";
import {MD3Theme as Theme} from "react-native-paper";
import SafeAreaView from "../../../../../Components/Layout/SafeAreaView";
import {IMediaSource} from "../../../../../Features/MediaViewer/IMediaSource";
import {useMediaFileActions} from "./Hooks/useMediaFileActions";
import {VolatileDataCollectionEventTypes} from "../../../../../Framework/Data/DataManager";
import {elevationShadowStyle} from "../../../../../Helpers/StyleUtils";
import {LoadingActivityIndicator} from "../../../../../Components/Controls";
import {useLoadingState} from "../../../../../Components/Hooks/useLoadingState";

const largeIconSize = hp(7);
const barHeight = largeIconSize / 1.5;
const iconSize = barHeight * 0.8;

declare type Props = {
    visible: boolean;
    parentEntityRestriction?: ParentEntityRestriction;
    mediaFileDataManager: IEntityDataManager<IMediaGalleryFile>;
    initialMediaFile: IMediaGalleryFile;
    onRequestClose: () => void;
}

export const ModalMediaFileViewer: React.FC<Props> = ({
                                                          visible,
                                                          initialMediaFile,
                                                          mediaFileDataManager,
                                                          onRequestClose,
                                                          parentEntityRestriction,
                                                      }) => {
    const volatileDataCollection = useVolatileEntityCollection<IMediaGalleryFile>(mediaFileDataManager, undefined, undefined, parentEntityRestriction);
    const [loading, setLoading] = useLoadingState(true);
    const {authentication} = useAuth();
    const [mediaSources, setMediaSources] = useState<IMediaSource[]>([]);
    const [initialIndex, setInitialIndex] = useState<number>(0);
    const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
    const [currentMediaFile, setCurrentMediaFile] = useState<IMediaGalleryFile | null>(initialMediaFile);
    const {onDelete, onShare} = useMediaFileActions(currentMediaFile, setCurrentMediaFile, mediaFileDataManager);

    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    async function initializeMediaData() {
        if (!volatileDataCollection || !authentication) {
            return;
        }

        const mediaGalleryFiles: IMediaGalleryFile[] = [];
        setLoading(true);
        try {
            for (let pageNumber = 1; pageNumber <= volatileDataCollection.totalPages; pageNumber++) {
                const page = await volatileDataCollection.getPage(pageNumber);
                if (page.data.length === 0) {
                    break; // broken pagination in spring data
                }
                mediaGalleryFiles.push(...page.data);
            }
        } finally {
            setLoading(false)
        }

        const mediaData = mediaGalleryFiles.map(mediaGalleryFile => {
            return {
                url: authentication.serverAddress + backendEndpoints.MediaGallery.MEDIA(mediaGalleryFile),
                width: mediaGalleryFile.width,
                height: mediaGalleryFile.height,
                mediaType: mediaGalleryFile.fileType,
                thumbnail: {
                    url: authentication.serverAddress + backendEndpoints.MediaGallery.MEDIA_THUMB(mediaGalleryFile)
                },
                props: {
                    source: {
                        headers: authentication.authorizationHeader
                    }
                },
                mediaFile: mediaGalleryFile
            };
        });

        if (mediaData.length === 0) {
            onRequestClose();
        }
        setMediaSources(mediaData);
    }

    useEffect(() => {
        initializeMediaData();
        volatileDataCollection?.on(VolatileDataCollectionEventTypes.DataChanged, initializeMediaData);
    }, [authentication, volatileDataCollection]);

    useEffect(() => {
        const mediaFile = mediaSources[currentMediaIndex]?.mediaFile;
        setCurrentMediaFile(mediaFile);
    }, [currentMediaIndex, mediaSources]);

    useEffect(() => {
        const index = mediaSources.findIndex(x => x.mediaFile.id === initialMediaFile.id);
        if (index === -1) {
            return;
        }
        setInitialIndex(index);
    }, [mediaSources, initialMediaFile.id]);

    const handleCurrentIndexChanged = useCallback((index: number) => {
        if (mediaSources.length === 0) {
            return;
        }
        setCurrentMediaIndex(index);
    }, [mediaSources]);

    const renderFooter = useCallback(() => {
        return (
            <View style={styles.footer}>
                <IconButton icon={'delete'} iconColor={theme.colors.primary} disabled={!currentMediaFile}
                            size={iconSize} onPress={onDelete}/>
                <IconButton icon={'share'} iconColor={theme.colors.primary} disabled={!currentMediaFile}
                            size={iconSize} onPress={onShare}/>
            </View>
        );
    }, [theme, styles, currentMediaFile, onDelete, onShare]);

    return (
        <Modal visible={visible}
               animationType={'fade'}
               transparent={true}
               onRequestClose={onRequestClose}>
            <SafeAreaView style={styles.container} ignoreBottomInsets={false}>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <LoadingActivityIndicator />
                    </View>
                )}
                <MediaViewer
                    mediaSources={mediaSources}
                    initialIndex={initialIndex}
                    onSwipeDown={onRequestClose}
                    renderFooter={renderFooter}
                    showThumbnails={true}
                    enableSwipeDown={true}
                    useNativeDriver={false}
                    thumbnailsContainerStyle={styles.thumbnailsContainer}
                    onCurrentIndexChanged={handleCurrentIndexChanged}
                />
            </SafeAreaView>
        </Modal>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1
    },
    footer: {
        ...elevationShadowStyle(theme),
        backgroundColor: theme.colors.surface,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row',
        height: barHeight,
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: hp(1),
        paddingRight: hp(1),
        width: '100%',
    },
    thumbnailsContainer: {
        bottom: barHeight + 20,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});
