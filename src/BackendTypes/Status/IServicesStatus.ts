export interface IServicesStatus {
  motionDetectorActive: boolean;
  framesProducerActive: boolean;
  framesProducerConnectionError: boolean;
  videoRecorderActive: boolean;
  objectDetectorActive: boolean;
  framesStreamerActive: boolean;
  framesStreamerReady: boolean;
}
