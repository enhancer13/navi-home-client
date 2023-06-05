import {IMediaGalleryFile, MediaGalleryFileTypes} from "../../BackendTypes";

import {IThumbnailInfo} from "./IThumbnailInfo";

export interface IMediaSource {
    mediaType: MediaGalleryFileTypes;
    url: string;
    thumbnail?: IThumbnailInfo;
    width?: number;
    height?: number;
    sizeKb?: number;
    originSizeKb?: number;
    originUrl?: string;
    props?: any;
    freeHeight?: boolean;
    freeWidth?: boolean;
    mediaFile: IMediaGalleryFile;
}
