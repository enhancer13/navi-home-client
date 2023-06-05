import {ApplicationSettings} from './ApplicationSettings';
import {IApplicationSettingsStorage} from './IApplicationSettingsStorage';
import LocalStorage from '../../../Framework/Data/LocalStorage/LocalStorage';

class ApplicationSettingsStorage extends LocalStorage<ApplicationSettings> implements IApplicationSettingsStorage {
    constructor() {
        super('application_settings');
    }

    async getApplicationSettings(): Promise<ApplicationSettings> {
        const applicationSettings = await this.getAll();
        if (applicationSettings.length != 1) {
            throw new Error("Application settings cannot be retrieved, cause data storage is not initialized or contains more then one application settings");
        }
        return applicationSettings[0];
    }
}

export const applicationSettingsStorage = new ApplicationSettingsStorage();
