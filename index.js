import {AppRegistry} from 'react-native';
import React, {useEffect, useState} from 'react';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {darkTheme, lightTheme} from './PaperTheme';
import {Provider as PaperProvider} from 'react-native-paper';
import {useApplicationSettings} from './src/Components/Hooks/DataStorage/useApplicationSettings';
import Orientation from 'react-native-orientation-locker';
import {requestFirebasePermissions} from './src/Helpers/PermisionRequester';
import {dataStorageInitializer} from './src/Features/LocalStorage';

const NotificationHandler = async message => {
  console.warn('RNFirebaseBackgroundMessage: ', message);
  return Promise.resolve();
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await NotificationHandler(remoteMessage);
});

const RenderApp = ({isHeadless}) => {
  const [theme, setTheme] = useState(lightTheme);
  const applicationSettings = useApplicationSettings();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    async function initializeApplication() {
      Orientation.lockToPortrait();
      await requestFirebasePermissions();
      await dataStorageInitializer.reset();
      await dataStorageInitializer.initialize();
      setAppInitialized(true);
    }

    initializeApplication();
  }, []);

  useEffect(() => {
    if (!applicationSettings) {
      return;
    }

    setTheme(applicationSettings.darkThemeActive ? darkTheme : lightTheme);
  }, [applicationSettings]);

  return !isHeadless && appInitialized && (
    <PaperProvider theme={theme} >
      <App/>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => RenderApp);
