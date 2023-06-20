import IDataStorage from '../../../Framework/Data/DataStorage/IDataStorage';
import {ApplicationSettings} from './ApplicationSettings';

export interface IApplicationSettingsStorage extends IDataStorage<ApplicationSettings> {
    getApplicationSettings(): Promise<ApplicationSettings | null>;
}
