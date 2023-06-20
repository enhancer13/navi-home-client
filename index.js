import {AppRegistry} from 'react-native';
import React, {useEffect, useState} from 'react';
import App from './App';
import {name as appName} from './app.json';
import Orientation from 'react-native-orientation-locker';
import {requestFirebasePermissions} from './src/Helpers/PermisionRequester';
import {dataStorageInitializer} from './src/Features/DataStorage';
import {AppProviders} from './AppProviders';
import PropTypes from 'prop-types';

const RenderApp = ({isHeadless}) => {
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    async function initializeApplication() {
      Orientation.lockToPortrait();
      await requestFirebasePermissions();
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
