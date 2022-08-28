import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VideoCameraEntityEditor from './components/VideoCameras/VideoCameraEntityEditor';
import SettingsMenuList from './components/SettingsMenuList';

const EntityEditorNavigator = createStackNavigator();

const Settings = () => {
  return (
    <EntityEditorNavigator.Navigator
      initialRouteName="EntityEditorList"
      screenOptions={{
        headerMode: false,
      }}
    >
      <EntityEditorNavigator.Screen
        name="EntityEditorList"
        component={SettingsMenuList}
      />
      <EntityEditorNavigator.Screen
        name="VideoCameraEntityEditor"
        component={VideoCameraEntityEditor}
      />
    </EntityEditorNavigator.Navigator>
  );
};

export default Settings;
