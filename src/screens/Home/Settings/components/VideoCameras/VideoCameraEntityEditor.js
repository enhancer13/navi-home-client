import React, {Component} from 'react';
import {EntityEditor} from '../../../../../components/EntityEditor';
import Globals from '../../../../../globals/Globals';
import VideoCamera from './VideoCamera';

export default class VideoCameraEntityEditor extends Component {
  onVideoCameraPress = (videoCamera) => {
    // this.props.navigation.navigate('MediaFileViewer', {
    //   folder,
    // });
  };

  render() {
    return (
      <EntityEditor
        navigation={this.props.navigation}
        entityName={Globals.Entities.VIDEO_CAMERA}
        ItemComponent={VideoCamera}
        title={'Video Cameras'}
        backButton={true}
        onItemPress={this.onVideoCameraPress}
      />
    );
  }
}
