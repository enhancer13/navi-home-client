export interface IServicesStatusAggregate {
  framesDispatcherStatus: boolean;
  framesProducerStatus: boolean;
  motionDetectorStatus: boolean;
  videoStreamerStatus: boolean;
  videoRecorderStatus: boolean;
  framesProducerInstanceCount: number;
  motionDetectorInstanceCount: number;
  videoStreamerInstanceCount: number;
  videoRecorderInstanceCount: number;
}
