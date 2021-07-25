import React from 'react';
import {EntityEditorList} from '../../../../../components/EntityEditor';
import Globals from '../../../../../globals/Globals';
import VideoCamera from './VideoCamera';

function VideoCameraEntityEditor(props) {
  return (
    <EntityEditorList
      navigation={props.navigation}
      entityName={Globals.Entities.VIDEO_CAMERA}
      ItemComponent={VideoCamera}
      title={'Video Cameras'}
      backButton={true}
      onEntityPress={this.onVideoCameraPress}
    />
  );
}

export default VideoCameraEntityEditor;
