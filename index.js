import {AppRegistry} from 'react-native';
import React, {useEffect, useState} from 'react';
import App from './src/App';
import {name as appName} from './app.json';
import Orientation from 'react-native-orientation-locker';
import {dataStorageInitializer} from './src/Features/DataStorage';
import {AppProviders} from './src/AppProviders';
import PropTypes from 'prop-types';
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('firebase message handled in the background', remoteMessage);
});

const RenderApp = ({isHeadless}) => {
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    async function initializeApplication() {
      Orientation.lockToPortrait();
      //__DEV__ && await dataStorageInitializer.reset();
      await dataStorageInitializer.initialize();
      setAppInitialized(true);
    }

    initializeApplication();
  }, []);

  return !isHeadless && appInitialized && (
    <AppProviders>
      <App/>
    </AppProviders>
  );
};

RenderApp.propTypes = {
  isHeadless: PropTypes.bool,
};

AppRegistry.registerComponent(appName, () => RenderApp);
