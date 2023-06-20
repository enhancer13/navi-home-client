import {ApplicationSettings} from './Settings/ApplicationSettings';
import {ServerInfo} from "./ServerInfo/ServerInfo";
import {serverInfoStorage} from "./ServerInfo/ServerInfoStorage";
import {applicationSettingsStorage} from "./Settings/ApplicationSettingsStorage";
import {Appearance} from "react-native";

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
        let serverInfos = [
            new ServerInfo('Kyiv', 'https://ip-2c41.proline.net.ua:49173'),
            new ServerInfo('Yalinka', 'https://176.104.16.214:34148'),
            new ServerInfo('Yudin', 'https://77.121.5.210:51569'),
        ];
        if (__DEV__) {
            serverInfos = serverInfos.concat([
                new ServerInfo('ios-dev', 'http://localhost:9000'),
                new ServerInfo('android-dev', 'http://10.0.2.2:9000'),
            ]);
        }
        await serverInfoStorage.saveMultiple(serverInfos);
    }

    async reset(): Promise<void> {
        await applicationSettingsStorage.deleteAll();
        await serverInfoStorage.deleteAll();
    }
}

export const dataStorageInitializer = new DataStorageInitializer();

