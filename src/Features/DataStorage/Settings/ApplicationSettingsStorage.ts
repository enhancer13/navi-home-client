import {ApplicationSettings} from './ApplicationSettings';
import {IApplicationSettingsStorage} from './IApplicationSettingsStorage';
import DataStorage from '../../../Framework/Data/DataStorage/DataStorage';

class ApplicationSettingsStorage extends DataStorage<ApplicationSettings> implements IApplicationSettingsStorage {
    constructor() {
        super('application_settings');
    }

    public async getApplicationSettings(): Promise<ApplicationSettings | null> {
        const applicationSettings = await this.getAll();
        if (applicationSettings.length != 1) {
            console.debug("Application settings cannot be retrieved, cause data storage is not initialized or contains more then one application settings");
            return null;
        }
        return applicationSettings[0];
    }
}

export const applicationSettingsStorage = new ApplicationSettingsStorage();
