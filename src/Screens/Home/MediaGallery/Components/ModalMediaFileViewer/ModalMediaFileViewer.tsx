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
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import SafeAreaView from "../../../../../Components/Layout/SafeAreaView";
import {IMediaSource} from "../../../../../Features/MediaViewer/IMediaSource";
import {useMediaFileActions} from "./Hooks/useMediaFileActions";
import {VolatileDataCollectionEventTypes} from "../../../../../Framework/Data/DataManager";
import {elevationShadowStyle} from "../../../../../Helpers/StyleUtils";

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
        volatileDataCollection.totalPages
        for (let pageNumber = 1; pageNumber <= volatileDataCollection.totalPages; pageNumber++) {
            const page = await volatileDataCollection.getPage(pageNumber);
            if (page.data.length === 0) {
                break; // broken pagination in spring data
            }
            mediaGalleryFiles.push(...page.data);
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
    }, [mediaSources]);

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
    }, [currentMediaFile, onDelete, onShare]);

    return (
        <Modal visible={visible}
               animationType={'fade'}
               transparent={true}
               onRequestClose={onRequestClose}>
            <SafeAreaView style={styles.container} ignoreBottomInsets={false}>
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
        ...elevationShadowStyle(theme, 10),
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        height: barHeight,
        justifyContent: 'space-between',
        marginBottom: 0,
        paddingLeft: hp(1),
        paddingRight: hp(1),
        width: '100%',
    },
    thumbnailsContainer: {
        bottom: barHeight + 10,
    }
});
