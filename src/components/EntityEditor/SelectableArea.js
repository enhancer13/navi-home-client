import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { LoadingActivityIndicator } from '../index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header from './Header';
import SelectableItem from './SelectableItem';
import PropTypes from 'prop-types';
import FlexContainer from '../View/FlexContainer';

export default class SelectableArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionMode: false,
      entities: [],
    };
  }

  deselectAll = () => {
    this.setState((prevState) => {
      const entities = [...prevState.entities];
      entities.forEach((el) => el.setSelected(false));
      return {
        entities,
      };
    });
  };

  selectAll = () => {
    this.setState((prevState) => {
      const entities = [...prevState.entities];
      entities.forEach((el) => el.setSelected(true));
      return {
        entities,
      };
    });
  };

  stopSelectionMode = () => {
    this.deselectAll();
    this.setState({
      selectionMode: false,
    });
  };

  renderItem = ({ item }) => {
    const entity = item;
    const { ItemComponent, numColumns, entityData, onRefresh } = this.props;
    const { selectionMode } = this.state;
    const colWidth = wp(Math.floor(100 / numColumns));
    return (
      <SelectableItem
        selectionMode={selectionMode}
        entityData={entityData}
        onEntityPress={() => {
          if (this.state.selectionMode) {
            this.setState((prevState) => {
              entity.toggleSelected();
              const entities = [...prevState.entities];
              return {
                entities,
              };
            });
          } else {
            this.props.onEntityPress(entity);
          }
        }}
        onRefresh={onRefresh}
        width={colWidth}
        onEntityLongPress={() => this.setState({ selectionMode: true })}
        entity={entity}
        ItemComponent={ItemComponent}
      />
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const entities = [...nextProps.entities];
    entities.forEach((entity) => {
      const previousItem = prevState.entities.find((el) => el.getItem().id === entity.getItem().id);
      entity.setSelected(previousItem ? previousItem.isSelected() : false);
    });
    return {
      entities,
    };
  }

  render() {
    const {
      loading,
      numColumns,
      title,
      subTitle,
      onSearch,
      onSearchClear,
      navigation,
      backButton,
      enableSearch,
      onSave,
      onCopy,
      onDelete,
      onRevert,
      onRefresh,
      entityData: { databaseMethods },
    } = this.props;
    const { entities, selectionMode } = this.state;
    const selectedItems = entities.filter((entity) => entity.isSelected());
    return (
      <FlexContainer bottomTransparency>
        <Header
          onSave={() => onSave(selectedItems)}
          onCopy={() => onCopy(selectedItems)}
          onDelete={() => onDelete(selectedItems)}
          onRevert={() => onRevert(selectedItems)}
          onSelectAll={this.selectAll}
          onDeselectAll={this.deselectAll}
          navigation={navigation}
          onSearch={onSearch}
          onSearchClear={onSearchClear}
          title={
            selectionMode
              ? `Selected items: ${entities.filter((entity) => entity.isSelected()).length} / ${
                  entities.length
              }`
              : title
          }
          subTitle={subTitle}
          backButton={backButton}
          enableSearch={enableSearch}
          selectionMode={selectionMode}
          onStopSelectionMode={this.stopSelectionMode}
          databaseMethods={databaseMethods}
        />
        {loading ? (
          <LoadingActivityIndicator />
        ) : (
          <FlatList
            numColumns={numColumns}
            keyExtractor={(entity) => entity.getItem().id.toString()}
            data={entities}
            renderItem={this.renderItem}
            style={styles.flatList}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapperStyle : null}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
            onEndReachedThreshold={0}
            onEndReached={this.props.onEndReached}
          />
        )}
      </FlexContainer>
    );
  }
}

SelectableArea.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  ItemComponent: PropTypes.elementType.isRequired,
  entityData: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  subTitle: PropTypes.string.isRequired,
  numColumns: PropTypes.number,
  onEntityPress: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRevert: PropTypes.func.isRequired,
  onSearchClear: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  backButton: PropTypes.bool.isRequired,
  enableSearch: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  columnWrapperStyle: {
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
  },
  flatList: {
    marginTop: 5,
  },
});
