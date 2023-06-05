import {ResizeModes} from './Enums/ResizeModes';
import {VideoCodecs} from './Enums/VideoCodecs';
import {VideoEncodingPresets} from './Enums/VideoEncodingPresets';
import {IEntity} from './IEntity';

export interface IVideoStreamingProfile extends IEntity {
  videoStreamingProfileName: string;
  description: string;
  processingFramerate: number;
  scaledOutputFramerate: number;
  videoFrameHeight: number;
  videoFrameWidth: number;
  resizeMode: ResizeModes;
  ffmpegLoggerEnabled: boolean;
  videoEncodingHardwareAcceleration: boolean;
  videoCodec: VideoCodecs;
  videoEncodingPreset: VideoEncodingPresets;
  gopSize: number;
  constantRateFactor: number;
  hlsListSize: number;
  hlsSegmentTime: number;
}
