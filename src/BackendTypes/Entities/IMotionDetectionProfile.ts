import {ResizeModes} from './Enums/ResizeModes';
import {IEntity} from './IEntity';

export interface IMotionDetectionProfile extends IEntity {
  motionDetectionProfileName: string;
  description: string;
  processingFramerate: number;
  frameHeight: number;
  frameWidth: number;
  resizeMode: ResizeModes;
  motionThresholdArea: number;
  segmentationThresholdValue: number;
  dilationKernelSize: number;
  minimumAllowedEventPublishingInterval: number;
  numberOfFramesToCollect: number;
}
