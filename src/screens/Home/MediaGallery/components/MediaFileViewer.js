import React, {Component} from 'react';
import Globals from '../../../../globals/Globals';
import ajaxRequest from '../../../../helpers/AjaxRequest';
import {SearchHeader} from '../../../../components/SearchHeader';
import {SelectableFlatList} from '../../../../components/SelectableFlatList';
import MediaFile from './MediaFile';
import MediaFileSingleViewer from './MediaFileSingleViewer';
import MediaFileTypes from './MediaFileTypes';
import {StyleSheet, View} from 'react-native';

class MediaFileViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: {},
      files: [],
      loading: true,
      searchValue: '',
      singleViewerActive: false,
      singleViewerInitialFile: {},
    };
  }

  searchQueryBuilder = (fileName) => {
    if (!fileName) {
      fileName = '';
    }
    return `?sort=fileName,desc&fileName=${fileName}&equal=false`;
  };

  fetchData = async (searchValue) => {
    if (typeof searchValue === 'undefined') {
      searchValue = this.state.searchValue;
    }
    const url = Globals.Endpoints.MediaGallery.FILES(this.state.folder.id) + this.searchQueryBuilder(searchValue);
    const response = await ajaxRequest.get(url);
    this.setState({
      files: response.filter((item) => item.fileType === MediaFileTypes.IMAGE),
      loading: false,
      searchValue,
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      folder: nextProps.route.params.folder,
    };
  }

  render() {
    const {loading, files, folder, singleViewerActive, singleViewerInitialFile} = this.state;
    return (
      <View style={styles.container}>
        <SearchHeader
          {...this.props}
          onSearch={this.fetchData}
          onSearchClear={this.fetchData}
          title={'File Viewer'}
          subTitle={`Number of images: ${folder.countImages}, videos: ${folder.countVideos}`}
          backButton={true}
          enableSearch={false}
        />
        <SelectableFlatList
          numColumns={3}
          ItemComponent={MediaFile}
          items={files}
          onItemPress={(file) => {
            this.setState({
              singleViewerActive: true,
              singleViewerInitialFile: file,
            });
          }}
          loading={loading}
          onRefresh={this.fetchData}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {MediaFileViewer};
