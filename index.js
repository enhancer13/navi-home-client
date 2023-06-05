import {AppRegistry} from 'react-native';
import React, {useEffect} from 'react';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {darkTheme, lightTheme} from './PaperTheme';
import {Provider as PaperProvider} from 'react-native-paper';
import {applicationSettingsStorage} from './src/Features/LocalStorage';
import {LocalStorageEventTypes} from './src/Framework/Data/LocalStorage';

const NotificationHandler = async message => {
  console.warn('RNFirebaseBackgroundMessage: ', message);
  return Promise.resolve();
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await NotificationHandler(remoteMessage);
});

const RenderApp = ({isHeadless}) => {
  const [theme, setTheme] = React.useState(lightTheme);

  useEffect(() => {
    applicationSettingsStorage.getApplicationSettings().then(handleApplicationSettingsChanged);
    applicationSettingsStorage.on(LocalStorageEventTypes.DataCreated, handleApplicationSettingsChanged);
    applicationSettingsStorage.on(LocalStorageEventTypes.DataChanged, handleApplicationSettingsChanged);

    return () => {
      applicationSettingsStorage.off(LocalStorageEventTypes.DataCreated, handleApplicationSettingsChanged);
      applicationSettingsStorage.off(LocalStorageEventTypes.DataChanged, handleApplicationSettingsChanged);
    }
  }, []);

  const handleApplicationSettingsChanged = (settings) => {
    setTheme(settings.darkThemeActive ? darkTheme : lightTheme);
  }

  return !isHeadless && (
    <PaperProvider theme={theme} >
      <App/>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => RenderApp);
