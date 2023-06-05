import {AlarmActions} from "./Enums/AlarmActions";
import {IEntity} from "./IEntity";

export interface IAlarmAction extends IEntity {
    alarmAction: AlarmActions;
}
