import {DayOfWeeks} from './Enums/DayOfWeeks';
import {IEntity} from './IEntity';

export interface IAlarmDayOfWeek extends IEntity {
    alarmDayOfWeek: DayOfWeeks;
}
