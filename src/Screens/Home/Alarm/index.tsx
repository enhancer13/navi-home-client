import React from 'react';
import AlarmProfile from './Components/AlarmProfile';
import {EntityListScreen} from "../../../Features/EntityList/EntityListScreen";
import {EntityNames} from "../../../BackendTypes";

export const AlarmProfilesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.AlarmProfile}
            EntityViewComponent={AlarmProfile}
            backButton={false}
        />
    );
}
