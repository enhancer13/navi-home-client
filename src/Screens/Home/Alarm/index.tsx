import React from 'react';
import AlarmProfile from './Components/AlarmProfile';
import {EntityListScreen} from '../../../Features/EntityList/EntityListScreen';
import {EntityNames} from '../../../BackendTypes';

export type AlarmProfilesScreenProp = {
    backButton?: boolean;
};

export const AlarmProfilesScreen: React.FC<AlarmProfilesScreenProp> = ({backButton}) => {
    return (
        <EntityListScreen
            entityName={EntityNames.AlarmProfile}
            EntityViewComponent={AlarmProfile}
            backButton={backButton}
        />
    );
};
