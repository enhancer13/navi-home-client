// noinspection JSSuspiciousNameCombination

import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import { GlobalStyles } from '../../../../globals/GlobalStyles';

function MediaFolder(props) {
  const {
    item: { countImages, countVideos, folderName, selected },
    width,
  } = props;
  return (
    <View style={{ height: width, width: width }}>
      <FastImage
        source={require('./Images/folder_icon.png')}
        style={styles.folder}
      />
      <View style={styles.leftIconContainer}>
        <FastImage
          source={require('./Images/folder_image.png')}
          style={styles.icon}
        />
        <Text style={styles.iconText}>{countImages}</Text>
      </View>
      <View style={styles.rightIconContainer}>
        <FastImage
          source={require('./Images/folder_video.png')}
          style={styles.icon}
        />
        <Text style={styles.iconText}>{countVideos}</Text>
      </View>
      <Text style={[styles.folderName, selected ? styles.textSelected : null]}>
        {folderName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  folder: {
    height: '79%', //folder icon size 630*500
    resizeMode: 'contain',
    width: '100%',
  },
  folderName: {
    alignSelf: 'flex-start',
    color: GlobalStyles.violetColor,
    marginLeft: 5,
  },
  icon: {
    height: '100%',
    width: '100%',
  },
  iconText: {
    alignSelf: 'center',
    color: GlobalStyles.whiteTextColor,
  },
  leftIconContainer: {
    height: '26%',
    left: '10%',
    position: 'absolute',
    top: '25%',
    width: '26%',
  },
  rightIconContainer: {
    height: '26%',
    position: 'absolute',
    right: '10%',
    top: '25%',
    width: '26%',
  },
  textSelected: {
    color: GlobalStyles.whiteTextColor,
  },
});

export default MediaFolder;
