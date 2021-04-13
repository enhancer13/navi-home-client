import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import AuthService from '../../../../helpers/AuthService';
import Globals from '../../../../globals/Globals';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;

function MediaGalleryFile(props) {
  return (
    <View style={styles.itemContainer}>
      <FastImage
        source={{
          uri: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.IMAGE_THUMB(props.item)),
          headers: AuthService.getAuthorizationHeader(),
          priority: FastImage.priority.normal,
        }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flexGrow: 1,
    width: windowWidth * 0.33,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    height: windowWidth * 0.33,
    justifyContent: 'center',
    width: windowWidth * 0.33,
  },
});

export default MediaGalleryFile;
