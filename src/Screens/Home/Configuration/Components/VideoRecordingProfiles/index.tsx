import React from 'react';
import {EntityListScreen} from '../../../../../Features/EntityList/EntityListScreen';
import {EntityNames} from '../../../../../BackendTypes';
import {VideoRecordingProfile} from './VideoRecordingProfile';

export const VideoRecordingProfilesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.VideoRecordingProfile}
            EntityViewComponent={VideoRecordingProfile}
            backButton={true}
        />
    );
};
