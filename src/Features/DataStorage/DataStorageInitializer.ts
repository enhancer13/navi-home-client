import {ApplicationSettings} from './Settings/ApplicationSettings';
import {ServerInfo} from './ServerInfo/ServerInfo';
import {serverInfoStorage} from './ServerInfo/ServerInfoStorage';
import {applicationSettingsStorage} from './Settings/ApplicationSettingsStorage';
import {Appearance} from 'react-native';

class DataStorageInitializer {
    async initialize(): Promise<void> {
        if ((await applicationSettingsStorage.count()) > 0) {
            return Promise.resolve();
        }

        //initialize default application settings
        const applicationSettings = new ApplicationSettings();
        applicationSettings.darkThemeActive = Appearance.getColorScheme() === 'dark';
        applicationSettings.biometryAuthenticationActive = false;
        await applicationSettingsStorage.save(applicationSettings);

        //initialize backend configuration
        const serverInfos: ServerInfo[] = [];
        if (__DEV__) {
            serverInfos.push(new ServerInfo('ios-dev', 'http://localhost:9000'));
            serverInfos.push(new ServerInfo('android-dev', 'http://10.0.2.2:9000'));
        }
        await serverInfoStorage.saveMultiple(serverInfos);
    }

    async reset(): Promise<void> {
        await applicationSettingsStorage.deleteAll();
        await serverInfoStorage.deleteAll();
    }
}

export const dataStorageInitializer = new DataStorageInitializer();

