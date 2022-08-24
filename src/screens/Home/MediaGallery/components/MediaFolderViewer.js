import React, { Component } from 'react';
import {applicationConstants} from '../../../../config/ApplicationConstants';
import MediaFolder from './MediaFolder';
import { isTablet } from 'react-native-device-info';
import { EntityEditorList } from '../../../../components/EntityEditor';

const numColumns = isTablet() ? 5 : 3;
const entityName = applicationConstants.Entities.MEDIA_GALLERY_FOLDER;

export default class MediaFolderViewer extends Component {
  onMediaFolderPress = (folder) => {
    this.props.navigation.navigate('MediaFileViewer', {
      folder,
    });
  };

  render() {
    return (
      <EntityEditorList
        navigation={this.props.navigation}
        entityName={entityName}
        ItemComponent={MediaFolder}
        numColumns={numColumns}
        title={'Media Gallery'}
        backButton={false}
        onEntityPress={this.onMediaFolderPress}
      />
    );
  }
}
