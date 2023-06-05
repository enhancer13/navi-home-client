import {IUser} from "./IUser";
import {IVideoSource} from "./IVideoSource";
import {IAlarmDayOfWeek} from "./IAlarmDayOfWeek";
import {IAlarmAction} from "./IAlarmAction";
import {IEntity} from "./IEntity";

export interface IAlarmProfile extends IEntity {
    profileName: string;
    description: string;
    active: boolean;
    startTime: Date;
    endTime: Date;
    suspendStartDateTime: Date;
    suspendEndDateTime: Date;
    suspendSecondsLeft: number;
    alarmDaysOfWeek: IAlarmDayOfWeek[];
    alarmActions: IAlarmAction[];
    videoSources: IVideoSource[];
    users: IUser[];
}

