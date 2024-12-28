import React from 'react';
import {MediaFolderViewer} from './MediaFolderViewer';
import {MediaFileViewer} from './MediaFileViewer';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {IMediaGalleryFolder} from '../../../BackendTypes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type GalleryStackParamList = {
    'Media Folder Viewer': React.FC;
    'Media File Viewer':  { folder: IMediaGalleryFolder; };
};
export type GalleryRouteProps<RouteName extends keyof GalleryStackParamList> = RouteProp<GalleryStackParamList, RouteName>;
export type GalleryNavigationProp = NavigationProp<GalleryStackParamList>;

const StackNavigator = createNativeStackNavigator<GalleryStackParamList>();

export const MediaGalleryStackNavigator = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Media Folder Viewer" screenOptions={{headerShown: false}}>
      <StackNavigator.Screen name="Media Folder Viewer" component={MediaFolderViewer} />
      <StackNavigator.Screen name="Media File Viewer" component={MediaFileViewer} />
    </StackNavigator.Navigator>
  );
};
