import { AppRegistry } from 'react-native';
import React from 'react';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

const NotificationHandler = async (message) => {
  console.warn('RNFirebaseBackgroundMessage: ', message);
  return Promise.resolve();
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await NotificationHandler(remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
