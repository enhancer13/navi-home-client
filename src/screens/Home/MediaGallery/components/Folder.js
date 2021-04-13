import {Dimensions, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';

const windowWidth = Dimensions.get('window').width;
const folderWidth = windowWidth * 0.3;
const folderHeight = windowWidth * 0.238; //folder icon size 630*500
const nestedIconSize = folderHeight * 0.33;

function MediaGalleryFolder(props) {
  const {countImages, countVideos, folderName, selected} = props.item;
  return (
    <View>
      <FastImage source={require('./Images/folder_icon.png')} style={styles.folder} />
      <View style={styles.folderImageContainer}>
        <FastImage source={require('./Images/folder_image.png')} style={styles.folderImage} />
        <Text style={styles.folderImageText}>{countImages}</Text>
      </View>
      <View style={styles.folderVideoContainer}>
        <FastImage source={require('./Images/folder_video.png')} style={styles.folderVideo} />
        <Text style={styles.folderVideoText}>{countVideos}</Text>
      </View>
      <Text style={selected ? styles.folderNameSelected : styles.folderName}>{folderName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  folder: {height: folderHeight, resizeMode: 'contain', width: folderWidth},
  folderImage: {height: nestedIconSize, width: nestedIconSize},
  folderImageContainer: {
    left: '10%',
    position: 'absolute',
    top: '25%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  folderImageText: {
    alignSelf: 'center',
    color: 'white',
  },
  // eslint-disable-next-line react-native/no-color-literals
  folderName: {alignSelf: 'flex-start', color: '#6959d5', marginLeft: 5},
  // eslint-disable-next-line react-native/no-color-literals
  folderNameSelected: {alignSelf: 'flex-start', color: 'white', marginLeft: 5},
  folderVideo: {height: nestedIconSize, width: nestedIconSize},
  folderVideoContainer: {
    position: 'absolute',
    right: '10%',
    top: '25%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  folderVideoText: {
    alignSelf: 'center',
    color: 'white',
  },
});

export default MediaGalleryFolder;
