import {StorageItem} from '../../../Framework/Data/DataStorage';

export class ApplicationSettings extends StorageItem {
  public autoLoginActive!: boolean;

  public darkThemeActive!: boolean;
}
