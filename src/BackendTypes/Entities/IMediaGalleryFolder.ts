import {IEntity} from './IEntity';

export interface IMediaGalleryFolder extends IEntity {
  folderName: string;

  folderPath: string;

  countImages: number;

  countVideos: number;
}
