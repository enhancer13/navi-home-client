import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Globals from '../../../../globals/Globals';
import { isTablet } from 'react-native-device-info';
import { EntityEditorList } from '../../../../components/EntityEditor';
import MediaFile from './MediaFile';
import MediaFileSingleViewer from './MediaFileSingleViewer';
import { View } from 'react-native';

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
    const { singleViewerActive, singleViewerInitialFile, folder, files } =
      this.state;
    return (
      <View style={styles.container}>
        <EntityEditorList
          navigation={this.props.navigation}
          entityName={entityName}
          ItemComponent={MediaFile}
          numColumns={numColumns}
          title={'File Viewer'}
          backButton={true}
          onEntityPress={this.onMediaFilePress}
          parentEntityName={parentEntityName}
          parentEntity={folder}
        />
        <MediaFileSingleViewer
          visible={singleViewerActive}
          files={files}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
