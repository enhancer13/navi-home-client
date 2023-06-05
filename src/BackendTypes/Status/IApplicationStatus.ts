import {IServicesStatusAggregate} from './IServicesStatusAggregate';
import {ISession} from '../Session/ISession';
import {IServicesStatusContainer} from './IServicesStatusContainer';

export interface IApplicationStatus {
  servicesStatusAggregate: IServicesStatusAggregate;
  serviceStatusContainers: IServicesStatusContainer[];
  sessions: ISession[];
  sensorStatuses: object[];
}
