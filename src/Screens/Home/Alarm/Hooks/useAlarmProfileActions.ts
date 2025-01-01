import {IAlarmProfile} from '../../../../BackendTypes/Entities/IAlarmProfile';
import {useEntityDataManager} from '../../../../Components/Hooks/EntityDataManager/useEntityDataManager';
import {useCallback} from 'react';

export const useAlarmProfileActions = (alarmProfile: IAlarmProfile) => {
    const entityDataManager = useEntityDataManager('AlarmProfile');

    const alarmProfileToggle = useCallback(async () => {
        await entityDataManager?.updateSingle({...alarmProfile, active: !alarmProfile.active}, ['active']);
    }, [alarmProfile, entityDataManager]);

    const suspendAlarmProfile = useCallback(async (minutes: number) => {
        await entityDataManager?.updateSingle({...alarmProfile, suspendSecondsLeft: minutes * 60}, ['suspendSecondsLeft']);
    }, [alarmProfile, entityDataManager]);

    return { alarmProfileToggle, suspendAlarmProfile };
};
