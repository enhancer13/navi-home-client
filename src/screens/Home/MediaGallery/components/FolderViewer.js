import React, {Component} from 'react';
import Globals from '../../../../globals/Globals';
import ajaxRequest from '../../../../helpers/AjaxRequest';
import {SearchHeader} from '../../../../components/SearchHeader';
import {SelectableFlatList} from '../../../../components/SelectableFlatList';
import Folder from './Folder';
import {StyleSheet, View} from 'react-native';

export class FolderViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryDetails: {
        totalFolders: 0,
      },
      pagination: {
        currentPage: 1,
        lastPage: 1,
      },
      folders: [],
      loading: true,
      searchValue: '',
    };
  }
  searchQueryBuilder = (folderName, page, size) => {
    if (!folderName) {
      folderName = '';
    }
    return `?page=${page}&size=${size}&sort=folderName,desc&folderName=${folderName}&equal=false`;
  };

  //TODO move pagination to helpers
  /*
   * "current_elements":18,
   * "current_page":1,
   * "data":[]
   * "elements_per_page":18,
   * "last_page":3,
   * "total_elements":40
   * */
  fetchData = async (searchValue, page = 1, size = 30) => {
    if (typeof searchValue === 'undefined') {
      searchValue = this.state.searchValue;
    }
    const url = Globals.Endpoints.MediaGallery.FOLDERS + this.searchQueryBuilder(searchValue, page, size);
    const response = await ajaxRequest.get(url);
    const folders = page === 1 ? response.data : [...this.state.folders].concat(response.data);
    this.setState({
      folders,
      loading: false,
      galleryDetails: {
        totalFolders: response.total_elements,
      },
      pagination: {
        currentPage: response.current_page,
        lastPage: response.last_page,
      },
      searchValue,
    });
  };

  fetchNextPage = async () => {
    const {
      searchValue,
      pagination: {currentPage, lastPage},
    } = this.state;
    if (currentPage < lastPage) {
      await this.fetchData(searchValue, currentPage + 1);
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    let {galleryDetails, loading, folders} = this.state;
    return (
      <View style={styles.container}>
        <SearchHeader
          {...this.props}
          onSearch={this.fetchData}
          title={'Media Gallery'}
          subTitle={`Number of folders: ${galleryDetails.totalFolders}`}
          backButton={false}
          enableSearch={true}
        />
        <SelectableFlatList
          numColumns={3}
          ItemComponent={Folder}
          items={folders}
          onItemPress={(folder) => {
            this.props.navigation.navigate('FileViewer', {
              folder,
            });
          }}
          loading={loading}
          onRefresh={this.fetchData}
          onEndReached={this.fetchNextPage}
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
