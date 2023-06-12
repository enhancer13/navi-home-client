import React from 'react';
import {EntityListScreen} from "../../../../../Features/EntityList/EntityListScreen";
import {EntityNames} from "../../../../../BackendTypes";
import {MotionDetectionProfile} from "./MotionDetectionProfile";

export const MotionDetectionProfilesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.MotionDetectionProfile}
            EntityViewComponent={MotionDetectionProfile}
            backButton={true}
        />
    );
}
