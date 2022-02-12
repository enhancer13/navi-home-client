import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoCameraEntityEditor from './components/VideoCameras/VideoCameraEntityEditor';
import EntityEditorList from './components/EntityEditorList';

const EntityEditorNavigator = createStackNavigator();

function Settings() {
  return (
    <EntityEditorNavigator.Navigator
      initialRouteName="EntityEditorList"
      screenOptions={{
        headerMode: false,
      }}
    >
      <EntityEditorNavigator.Screen
        name="EntityEditorList"
        component={EntityEditorList}
      />
      <EntityEditorNavigator.Screen
        name="VideoCameraEntityEditor"
        component={VideoCameraEntityEditor}
      />
    </EntityEditorNavigator.Navigator>
  );
}

export default Settings;
