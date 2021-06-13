import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MediaFolderViewer from './components/MediaFolderViewer';
import MediaFileViewer from './components/MediaFileViewer';

const GalleryNavigator = createStackNavigator();

function MediaGalleryNavigator() {
  return (
    <GalleryNavigator.Navigator initialRouteName="MediaFolderViewer" headerMode={false}>
      <GalleryNavigator.Screen name="MediaFolderViewer" component={MediaFolderViewer} />
      <GalleryNavigator.Screen name="MediaFileViewer" component={MediaFileViewer} />
    </GalleryNavigator.Navigator>
  );
}

export default MediaGalleryNavigator;
