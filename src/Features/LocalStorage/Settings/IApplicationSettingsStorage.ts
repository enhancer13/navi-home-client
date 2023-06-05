import ILocalStorage from '../../../Framework/Data/LocalStorage/ILocalStorage';
import {ApplicationSettings} from './ApplicationSettings';

export interface IApplicationSettingsStorage extends ILocalStorage<ApplicationSettings> {
    getApplicationSettings(): Promise<ApplicationSettings>;
}
