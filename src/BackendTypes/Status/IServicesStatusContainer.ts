import {IVideoSource} from '../Entities/IVideoSource';
import {IServicesStatus} from './IServicesStatus';

export interface IServicesStatusContainer {
  videoSource: IVideoSource;

  servicesStatus: IServicesStatus;
}
