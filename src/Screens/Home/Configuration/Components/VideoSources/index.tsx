import React from 'react';
import {EntityListScreen} from "../../../../../Features/EntityList/EntityListScreen";
import {EntityNames} from "../../../../../BackendTypes";
import {VideoSource} from "./VideoSource";

export const VideoSourcesScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.VideoSource}
            EntityViewComponent={VideoSource}
            backButton={true}
        />
    );
}
