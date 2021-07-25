// noinspection JSSuspiciousNameCombination

import React from 'react';
import {StyleSheet, View} from 'react-native';
import AuthService from '../../../../helpers/AuthService';
import Globals from '../../../../globals/Globals';
import FastImage from 'react-native-fast-image';
import MediaFileTypes from './MediaFileTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

function MediaFile(props) {
  const {item, width} = props;
  // noinspection JSSuspiciousNameCombination
  return (
    <View style={[styles.itemContainer, {height: width, width: width}]}>
      {item.fileType === MediaFileTypes.VIDEO ? (
        <View style={styles.playButton}>
          <Ionicons name={'play'} color={'white'} size={width * 0.3} />
        </View>
      ) : null}
      <FastImage
        source={{
          uri: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.MEDIA_THUMB(item)),
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
    height: '100%',
    width: '100%',
  },
  itemContainer: {
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

export default MediaFile;
