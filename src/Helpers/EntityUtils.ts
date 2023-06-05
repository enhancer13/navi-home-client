import {IEntity} from "../BackendTypes";
import {IAlarmProfile} from "../BackendTypes/Entities/IAlarmProfile";

export const isEntityArray = (data: any): data is IEntity[] => {
    return Array.isArray(data) && data.every(item => item !== null && typeof item === 'object' && 'id' in item);
}

export const isEntity = (data: any): data is IEntity => {
    return data !== null && typeof data === 'object' && 'id' in data && typeof data.id === 'number';
}

export const isAlarmProfile = (data: any): data is IAlarmProfile => {
    return isEntity(data) &&
        'profileName' in data && typeof data.profileName === 'string' &&
        'description' in data && typeof data.description === 'string' &&
        'active' in data && typeof data.active === 'boolean' &&
        'startTime' in data && typeof data.startTime === 'string' &&
        'endTime' in data && typeof data.endTime === 'string' &&
        'suspendStartDateTime' in data && typeof data.suspendStartDateTime === 'string' &&
        'suspendEndDateTime' in data && typeof data.suspendEndDateTime === 'string' &&
        'suspendSecondsLeft' in data && typeof data.suspendSecondsLeft === 'number' &&
        'alarmDaysOfWeek' in data && Array.isArray(data.alarmDaysOfWeek) &&
        'alarmActions' in data && Array.isArray(data.alarmActions) &&
        'videoSources' in data && Array.isArray(data.videoSources) &&
        'users' in data && Array.isArray(data.users);
}
