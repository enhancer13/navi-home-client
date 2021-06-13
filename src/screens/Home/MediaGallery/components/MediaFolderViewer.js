import React, {Component} from 'react';
import Globals from '../../../../globals/Globals';
import MediaFolder from './MediaFolder';
import {isTablet} from 'react-native-device-info';
import {EntityEditor} from '../../../../components/EntityEditor';

const numColumns = isTablet() ? 5 : 3;
const entityName = Globals.Entities.MEDIA_GALLERY_FOLDER;

export default class MediaFolderViewer extends Component {
  onFilePress = (folder) => {
    this.props.navigation.navigate('MediaFileViewer', {
      folder,
    });
  };

  render() {
    return (
      <EntityEditor
        navigation={this.props.navigation}
        entityName={entityName}
        ItemComponent={MediaFolder}
        numColumns={numColumns}
        title={'Media Gallery'}
        backButton={false}
        onItemPress={this.onFilePress}
      />
    );
  }
}
