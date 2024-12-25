import React, {useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useTheme} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper";
import {IMediaSource} from "../../IMediaSource";

type ThumbnailItemProps = {
    item: IMediaSource;
    index: number;
    size: number;
    isSelected: boolean;
    onPress: (index: number) => void;
}

export const ThumbnailItem: React.FC<ThumbnailItemProps> = ({item, index, size, isSelected, onPress}) => {
    const {thumbnail} = item;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme, size), [theme, size]);

    const handlePress = () => {
        onPress(index);
    };

    if (!thumbnail) {
        return (
            <Pressable onPress={handlePress} style={styles.thumbnailContainer}>
                <MaterialCommunityIcons name="image-off-outline" size={wp(5)} color={theme.colors.onBackground}/>
            </Pressable>
        );
    }

    return (
        <Pressable onPress={handlePress} style={styles.thumbnailContainer}>
            <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={[styles.thumbnailImage, isSelected && styles.thumbnailImageSelected]}
                source={{
                    uri: thumbnail.url,
                    priority: FastImage.priority.normal,
                    headers: item.props.source.headers,
                    cache: FastImage.cacheControl.immutable
                }}
            />
        </Pressable>
    );
};

const createStyles = (theme: Theme, thumbnailSize: number) => StyleSheet.create({
    thumbnailContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: thumbnailSize,
        height: thumbnailSize,
        backgroundColor: theme.colors.background,
    },
    thumbnailImage: {
        width: thumbnailSize,
        height: thumbnailSize,
    },
    thumbnailImageSelected: {
        borderColor: theme.colors.primary,
        borderWidth: thumbnailSize / 15,
        borderRadius: thumbnailSize / 10,
    },
});
