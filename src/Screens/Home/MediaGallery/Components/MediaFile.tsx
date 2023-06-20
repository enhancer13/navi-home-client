import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {backendEndpoints} from '../../../../Config/BackendEndpoints';
import {EntityViewComponentProps} from "../../../../Features/EntityList/EntityListScreen";
import {IMediaGalleryFile, MediaGalleryFileTypes} from "../../../../BackendTypes";
import {useAuth} from "../../../../Features/Authentication";
import {IconButton, useTheme} from "react-native-paper";

const mediaFilePropsAreEqual = (prevProps: EntityViewComponentProps, nextProps: EntityViewComponentProps): boolean => {
    return (
        prevProps.width === nextProps.width &&
        prevProps.entity.id === nextProps.entity.id
    );
};

// eslint-disable-next-line react/prop-types
export const MediaFile: React.FC<EntityViewComponentProps> = React.memo(({entity, width}) => {
    const mediaFile = entity as IMediaGalleryFile;
    const {authentication} = useAuth();
    const theme = useTheme();

    if (!authentication) {
        return null;
    }

    // noinspection JSSuspiciousNameCombination
    return (
        <View style={[styles.container, {height: width, width: width}]}>
            {mediaFile.fileType === MediaGalleryFileTypes.VIDEO &&
              <View style={styles.playButton}>
                <IconButton icon={'movie-open-play'} iconColor={theme.colors.onBackground} size={width * 0.3} mode={'contained'}/>
              </View>
            }
            <FastImage
                source={{
                    uri: authentication.serverAddress + backendEndpoints.MediaGallery.MEDIA_THUMB(mediaFile),
                    headers: authentication.authorizationHeader,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
    );
}, mediaFilePropsAreEqual);

MediaFile.displayName = 'MediaFile';

const styles = StyleSheet.create({
    image: {
        flexGrow: 1,
        height: '100%',
        width: '100%',
    },
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    playButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
    },
});
