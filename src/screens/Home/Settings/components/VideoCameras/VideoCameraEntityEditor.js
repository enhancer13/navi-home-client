import React from 'react';
import { EntityEditorList } from '../../../../../components/EntityEditor';
import {applicationConstants} from '../../../../../config/ApplicationConstants';
import VideoCamera from './VideoCamera';

function VideoCameraEntityEditor(props) {
  return (
    <EntityEditorList
      navigation={props.navigation}
      entityName={applicationConstants.Entities.VIDEO_CAMERA}
      ItemComponent={VideoCamera}
      title={'Video Cameras'}
      backButton={true}
      onEntityPress={this.onVideoCameraPress}
    />
  );
}

export default VideoCameraEntityEditor;
