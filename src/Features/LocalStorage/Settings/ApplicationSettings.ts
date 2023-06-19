import {StorageItem} from '../../../Framework/Data/DataStorage';

export class ApplicationSettings extends StorageItem {
  public biometryAuthenticationActive!: boolean;

  public darkThemeActive!: boolean;
}
