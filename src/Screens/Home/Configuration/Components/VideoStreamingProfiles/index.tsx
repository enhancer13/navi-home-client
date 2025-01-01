import React from 'react';
import {EntityListScreen} from '../../../../../Features/EntityList/EntityListScreen';
import {EntityNames} from '../../../../../BackendTypes';
import {VideoStreamingProfile} from './VideoStreamingProfile';

export const VideoStreamingProfilesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.VideoStreamingProfile}
            EntityViewComponent={VideoStreamingProfile}
            backButton={true}
        />
    );
};
