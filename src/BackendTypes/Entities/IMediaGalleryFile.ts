import {IEntity} from './IEntity';
import {MediaGalleryFileTypes} from "./Enums/MediaGalleryFileTypes";
import {IMediaGalleryFolder} from "./IMediaGalleryFolder";

export interface IMediaGalleryFile extends IEntity {
  fileName: string;

  filePath: string;

  height: number;

  width: number;

  fileType: MediaGalleryFileTypes;

  mediaGalleryFolder: IMediaGalleryFolder;
}
