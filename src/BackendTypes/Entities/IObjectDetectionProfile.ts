import {ResizeModes} from './Enums/ResizeModes';
import {IEntity} from './IEntity';

export interface IObjectDetectionProfile extends IEntity {
  objectDetectionProfileName: string;
  description: string;
  processingFramerate: number;
  confidenceValue: number;
  videoFrameHeight: number;
  videoFrameWidth: number;
  resizeMode: ResizeModes;
  trainingModeEnabled: boolean;
  collectWithMotion: boolean;
  collectWithoutMotion: boolean;
  collectingIntervalWithoutMotion: number;
  minimumCollectingIntervalWithMotion: number;
  collectingDirectoryPath: string;
  trainingVideoFrameHeight: number;
  trainingVideoFrameWidth: number;
}
