import {VideoCodecs} from './Enums/VideoCodecs';
import {ResizeModes} from './Enums/ResizeModes';
import {VideoEncodingPresets} from './Enums/VideoEncodingPresets';
import {VideoEncodingProfiles} from './Enums/VideoEncodingProfiles';
import {IEntity} from './IEntity';

export interface IVideoRecorderProfile extends IEntity {
  videoRecorderProfileName: string;
  description: string;
  fileNamePattern: string;
  videoCodec: VideoCodecs;
  processingFramerate: number;
  scaledOutputFramerate: number;
  ffmpegLoggerEnabled: boolean;
  videoEncodingHardwareAcceleration: boolean;
  videoFrameHeight: number;
  videoFrameWidth: number;
  resizeMode: ResizeModes;
  videoEncodingPreset: VideoEncodingPresets;
  VideoEncodingProfilesEnum: VideoEncodingProfiles;
  gopSize: number;
  constantRateFactor: number;
}
