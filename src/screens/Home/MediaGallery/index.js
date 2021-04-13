import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {FolderViewer} from './components/FolderViewer';
import {MediaFileViewer} from './components/MediaFileViewer';

const GalleryNavigator = createStackNavigator();

function MediaGalleryNavigator() {
  return (
    <GalleryNavigator.Navigator initialRouteName="MediaGallery" headerMode={false}>
      <GalleryNavigator.Screen name="FolderViewer" component={FolderViewer} />
      <GalleryNavigator.Screen name="FileViewer" component={MediaFileViewer} />
    </GalleryNavigator.Navigator>
  );
}

export default MediaGalleryNavigator;
