import React, {Component} from 'react';
import Pagination from '../../helpers/Pagination';
import {StyleSheet, View} from 'react-native';
import {SelectableArea} from '../SelectableArea';
import entityEditorData from './EntityEditorData';
import PropTypes from 'prop-types';
import {isTablet} from 'react-native-device-info';
import AjaxRequest from '../../helpers/AjaxRequest';

export default class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.entityEditorData = entityEditorData;
    this.state = {
      editorDetails: {
        totalItems: 0,
      },
      items: [],
      loading: true,
      activeSearchValue: '',
    };
  }

  processServerResponse = async (response, currentPage) => {
    const items = currentPage === 1 ? response.data : [...this.state.items].concat(response.data);
    this.setState({
      items,
      loading: false,
      editorDetails: {
        totalItems: response.total_elements,
      },
    });
  };

  onSave = async () => {
    const selectedItems = [...this.state.items].filter((item) => item.selected);
    const {databaseMethods, controllerUrl} = this.entityData;
    try {
      const newItems = selectedItems.filter((item) => !item.id);
      if (databaseMethods.create && newItems.length) {
        await AjaxRequest.post(controllerUrl, newItems);
      }

      const updatedItems = selectedItems.filter((item) => item.id && item.updated);
      if (databaseMethods.update && updatedItems.length) {
        await AjaxRequest.post(controllerUrl, updatedItems);
      }
    } catch (ex) {
      //TODO error handling
    }
  };

  onDelete = async () => {
    const deletedItems = [...this.state.items].filter((item) => item.selected);
    const {databaseMethods, controllerUrl} = this.entityData;
    try {
      if (databaseMethods.delete && deletedItems.length) {
        await AjaxRequest.delete(controllerUrl, deletedItems);
      }
    } catch (ex) {
      //TODO error handling
    }
  };

  async componentDidMount() {
    await this.entityEditorData.Initialize();
    const {entityName, parentEntityName, parentEntity} = this.props;
    const paginationDetails = this.entityEditorData.GetPaginationData(entityName);

    if (parentEntityName) {
      const parentPrimarySearchField = this.entityEditorData.GetPrimarySearchField(parentEntityName);
      paginationDetails.extraSearchCondition = `&${parentPrimarySearchField}=${parentEntity[parentPrimarySearchField]}`;
    }
    this.entityData = this.entityEditorData.GetEntityData(entityName);
    this.pagination = new Pagination(paginationDetails);
    await this.pagination.fetchPage(this.processServerResponse);
  }

  onSearch = (searchValue) => {
    this.pagination.fetchPage(this.processServerResponse, searchValue).then(() => {
      this.setState({
        activeSearchValue: searchValue,
      });
    });
  };

  render() {
    const {editorDetails, loading, items, activeSearchValue} = this.state;
    const {ItemComponent, navigation, numColumns = isTablet() ? 2 : 1, title, onItemPress, backButton = true, enableSearch = true} = this.props;
    return (
      <View style={styles.container}>
        <SelectableArea
          navigation={navigation}
          ItemComponent={ItemComponent}
          items={items}
          title={title}
          subTitle={`Number of items: ${editorDetails.totalItems}`}
          loading={loading}
          backButton={backButton}
          enableSearch={enableSearch}
          numColumns={numColumns}
          onItemPress={(item) => onItemPress(item, items)}
          onSave={this.onSave}
          onDelete={this.onDelete}
          onSearch={this.onSearch}
          onSearchClear={this.onSearch}
          onRefresh={() => this.pagination.fetchPage(this.processServerResponse, activeSearchValue)}
          onEndReached={() => this.pagination.fetchNextPage(this.processServerResponse, activeSearchValue)}
        />
      </View>
    );
  }
}

EntityEditor.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  ItemComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  numColumns: PropTypes.number,
  onItemPress: PropTypes.func.isRequired,
  backButton: PropTypes.bool,
  enableSearch: PropTypes.bool,
  parentEntityName: PropTypes.string,
  parentEntity: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
