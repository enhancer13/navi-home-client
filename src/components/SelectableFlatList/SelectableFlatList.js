import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {LoadingActivityIndicator} from '../index';
import ActionsBar from './ActionsBar';
import SelectableItem from './SelectableItem';

export default class SelectableFlatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionMode: false,
      items: [],
    };
  }

  closeSelectionMode = () => {
    this.setState((prevState) => {
      const items = [...prevState.items];
      items.forEach((el) => (el.selected = false));
      return {
        items,
        selectionMode: false,
      };
    });
  };

  renderItem = (item, selectionMode) => {
    const {ItemComponent} = this.props;
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
        onItemLongPress={() => this.setState((prevState) => ({selectionMode: !prevState.selectionMode}))}
        item={item}
        itemComponent={<ItemComponent item={item} />}
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
    const {loading, numColumns = 3} = this.props;
    const {selectionMode, items} = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <LoadingActivityIndicator />
        ) : (
          <FlatList
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            data={items}
            renderItem={({item}) => this.renderItem(item, selectionMode)}
            style={styles.flatList}
            columnWrapperStyle={styles.columnWrapperStyle}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={this.props.onRefresh} />}
            onEndReachedThreshold={0}
            onEndReached={this.props.onEndReached}
          />
        )}
        {selectionMode ? <ActionsBar onSave={() => {}} onDelete={() => {}} onClose={this.closeSelectionMode} style={styles.actionsBar} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionsBar: {
    bottom: 0,
    position: 'absolute',
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  flatList: {
    marginTop: 5,
  },
});
