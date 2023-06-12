import {FramesSources} from './Enums/FramesSources';
import {IVideoStreamingProfile} from './IVideoStreamingProfile';
import {IObjectDetectionProfile} from './IObjectDetectionProfile';
import {IMotionDetectionProfile} from './IMotionDetectionProfile';
import {IVideoRecorderProfile} from './IVideoRecorderProfile';
import {IEntity} from './IEntity';

export interface IVideoSource extends IEntity {
  cameraName: string;
  description: string;
  url: string;
  frameHeight: number;
  frameWidth: number;
  framesFrequency: number;
  recordingSource: FramesSources;
  streamingSource: FramesSources;
  cameraAutoStart: boolean;
  videoRecordingAllowed: boolean;
  motionDetectionAllowed: boolean;
  videoStreamingAllowed: boolean;
  objectDetectionAllowed: boolean;
  videoStreamingProfile: IVideoStreamingProfile;
  objectDetectionProfile: IObjectDetectionProfile;
  motionDetectionProfile: IMotionDetectionProfile;
  videoRecordingProfile: IVideoRecorderProfile;
}
