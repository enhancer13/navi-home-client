import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {LoadingActivityIndicator} from '../index';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Header from './Header';
import SelectableItem from './SelectableItem';
import PropTypes from 'prop-types';

export default class SelectableArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionMode: false,
      items: [],
    };
  }

  stopSelectionMode = () => {
    this.deselectAll();
    this.setState({
      selectionMode: false,
    });
  };

  startSelectionMode = () => {
    this.setState({selectionMode: true});
  };

  deselectAll = () => {
    this.setState((prevState) => {
      const items = [...prevState.items];
      items.forEach((el) => (el.selected = false));
      return {
        items,
      };
    });
  };

  selectAll = () => {
    this.setState((prevState) => {
      const items = [...prevState.items];
      items.forEach((el) => (el.selected = true));
      return {
        items,
      };
    });
  };

  renderItem = (item) => {
    const {ItemComponent, numColumns} = this.props;
    const {selectionMode} = this.state;
    const itemWidth = wp(Math.floor(100 / numColumns));
    return (
      <SelectableItem
        selectionMode={selectionMode}
        onItemPress={() => {
          if (selectionMode) {
            this.setState((prevState) => {
              item.selected = !item.selected;
              const items = [...prevState.items];
              return {
                items,
              };
            });
          } else {
            this.props.onItemPress(item);
          }
        }}
        width={itemWidth}
        //height={itemWidth}
        onItemLongPress={this.startSelectionMode}
        item={item}
        ItemComponent={ItemComponent}
      />
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const items = [...nextProps.items];
    items.forEach((item) => {
      const previousItem = prevState.items.find((el) => el.id === item.id);
      item.selected = previousItem ? previousItem.selected : false;
    });
    return {
      items,
    };
  }

  render() {
    const {loading, numColumns, title, subTitle, onSearch, onSearchClear, navigation, backButton, enableSearch, onSave, onDelete} = this.props;
    const {items, selectionMode} = this.state;
    return (
      <View style={styles.container}>
        <Header
          onSave={onSave}
          onDelete={onDelete}
          onSelectAll={this.selectAll}
          onDeselectAll={this.deselectAll}
          navigation={navigation}
          onSearch={onSearch}
          onSearchClear={onSearchClear}
          title={selectionMode ? `Selected items: ${items.filter((item) => item.selected).length} / ${items.length}` : title}
          subTitle={subTitle}
          backButton={backButton}
          enableSearch={enableSearch}
          selectionMode={selectionMode}
          onStopSelectionMode={this.stopSelectionMode}
        />
        {loading ? (
          <LoadingActivityIndicator />
        ) : (
          <FlatList
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            data={items}
            renderItem={({item}) => this.renderItem(item)}
            style={styles.flatList}
            columnWrapperStyle={styles.columnWrapperStyle}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={this.props.onRefresh} />}
            onEndReachedThreshold={0}
            onEndReached={this.props.onEndReached}
          />
        )}
      </View>
    );
  }
}

SelectableArea.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  ItemComponent: PropTypes.elementType.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  subTitle: PropTypes.string.isRequired,
  numColumns: PropTypes.number,
  onItemPress: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
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
    paddingLeft: 5,
    paddingRight: 5,
  },
});
