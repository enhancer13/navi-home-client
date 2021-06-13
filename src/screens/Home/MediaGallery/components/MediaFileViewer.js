import React, {Component} from 'react';
import Globals from '../../../../globals/Globals';
import {isTablet} from 'react-native-device-info';
import {EntityEditor} from '../../../../components/EntityEditor';
import MediaFile from './MediaFile';
import MediaFileSingleViewer from './MediaFileSingleViewer';
import {View} from 'react-native';

const numColumns = isTablet() ? 5 : 3;
const entityName = Globals.Entities.MEDIA_GALLERY_FILE;
const parentEntityName = Globals.Entities.MEDIA_GALLERY_FOLDER;

export default class MediaFileViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singleViewerActive: false,
      singleViewerInitialFile: {},
      files: [],
    };
  }

  onMediaFilePress = async (file, files) => {
    this.setState({
      singleViewerActive: true,
      singleViewerInitialFile: file,
      files,
    });
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      folder: nextProps.route.params.folder,
    };
  }

  render() {
    const {singleViewerActive, singleViewerInitialFile, folder} = this.state;
    return (
      <View>
        <EntityEditor
          navigation={this.props.navigation}
          entityName={entityName}
          ItemComponent={MediaFile}
          numColumns={numColumns}
          title={'File Viewer'}
          backButton={true}
          onItemPress={this.onMediaFilePress}
          parentEntityName={parentEntityName}
          parentEntity={folder}
        />
        <MediaFileSingleViewer
          visible={singleViewerActive}
          files={this.state.files}
          initialFile={singleViewerInitialFile}
          onRequestClose={() => {
            this.setState({
              singleViewerActive: false,
            });
          }}
        />
      </View>
    );
  }
}
