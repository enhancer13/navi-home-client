import React from 'react';
import {EntityListScreen} from '../../../../../Features/EntityList/EntityListScreen';
import {EntityNames} from '../../../../../BackendTypes';
import {ObjectDetectionProfile} from './ObjectDetectionProfile';

export const ObjectDetectionProfilesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.ObjectDetectionProfile}
            EntityViewComponent={ObjectDetectionProfile}
            backButton={true}
        />
    );
};
