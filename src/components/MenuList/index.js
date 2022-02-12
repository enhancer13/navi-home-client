import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { GlobalStyles } from '../../globals/GlobalStyles';
import Storage from '../../helpers/Storage';

export default class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  listItemOnPress = async (item) => {
    //handle action delegates
    if (item.action) {
      item.action();
      return;
    }

    //handle simple controls based on Storage state - checkboxes, switches...
    if (item.stateProperty) {
      const stateProperty = item.stateProperty;
      const value = !this.state[item.stateProperty];
      await this.setState({ [item.stateProperty]: value });
      await Storage.setBooleanItem(stateProperty, value);
    }
  };

  renderItem = ({ item }) => (
    <ListItem
      Component={TouchableScale}
      friction={90}
      tension={100}
      activeScale={0.95}
      containerStyle={styles.listItemContainer}
      bottomDivider
      onPress={() => this.listItemOnPress(item)}
    >
      <Icon
        name={item.icon.name}
        type={item.icon.type}
        color={GlobalStyles.violetIconColor}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{
            color: GlobalStyles.blackTextColor,
            fontSize: GlobalStyles.defaultFontSize,
          }}
        >
          {item.name}
        </ListItem.Title>
      </ListItem.Content>

      {item.checkbox ? (
        <ListItem.CheckBox
          checkedColor={GlobalStyles.violetColor}
          uncheckedColor={GlobalStyles.lightVioletColor}
          checked={this.state[item.stateProperty]}
          onPress={() => this.listItemOnPress(item)}
        />
      ) : null}
    </ListItem>
  );

  componentDidMount() {
    this.props.items
      .filter((item) => item.stateProperty)
      .forEach((item) => {
        Storage.getBooleanItem(item.stateProperty).then((value) =>
          this.setState({ [item.stateProperty]: value })
        );
      });
  }

  render() {
    return (
      <View style={styles.listContainer}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.props.items}
          renderItem={(item) => this.renderItem(item)}
          style={styles.flatList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    width: '98%',
  },
  listContainer: {
    alignItems: 'center',
    flex: 1,
  },
  listItemContainer: {
    backgroundColor: GlobalStyles.softLightVioletColor,
    borderRadius: 10,
    marginBottom: 2,
    marginTop: 2,
  },
});
