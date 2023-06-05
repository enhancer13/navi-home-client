import {StorageItem} from '../../../Framework/Data/LocalStorage';

export class ApplicationSettings extends StorageItem {
  public biometryAuthenticationActive!: boolean;

  public darkThemeActive!: boolean;
}
