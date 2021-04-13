import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Storage from '../../../helpers/Storage';
import AuthService from '../../../helpers/AuthService';
import {Icon, ListItem} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Globals from '../../../globals/Globals';
import {GlobalStyles} from '../../../globals/GlobalStyles';

const itemActionsEnum = {Logout: 'logout'};
const listItems = [
  {
    name: 'Biometric authentication enabled',
    icon: {
      name: 'finger-print',
      type: 'ionicon',
    },
    stateProperty: Globals.FINGERPRINT_ACTIVE,
    checkbox: true,
  },
  {
    name: 'Logout',
    icon: {
      name: 'sign-out',
      type: 'font-awesome',
    },
    action: itemActionsEnum.Logout,
  },
];

export default class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  listItemOnPress = async (item) => {
    switch (item.action) {
      case itemActionsEnum.Logout:
        await AuthService.logout(this.props.navigation);
        break;
      default:
        break;
    }
  };

  listItemCheckboxOnPress = async (item) => {
    let stateProperty = item.stateProperty;
    let value = !this.state[stateProperty];
    await this.setState({[stateProperty]: value});
    switch (stateProperty) {
      case Globals.FINGERPRINT_ACTIVE:
        await Storage.setBooleanItem(stateProperty, value);
        break;
      default:
        console.error(`Unknown checkbox action: ${stateProperty}`);
    }
  };

  renderItem = ({item}) => (
    <ListItem
      Component={TouchableScale}
      friction={90}
      tension={100}
      activeScale={0.95}
      containerStyle={styles.listItemContainer}
      bottomDivider
      onPress={() => this.listItemOnPress(item)}>
      <Icon name={item.icon.name} type={item.icon.type} color={GlobalStyles.violetIconColor} />
      <ListItem.Content>
        <ListItem.Title style={{color: GlobalStyles.listItem.textColor, fontSize: GlobalStyles.defaultFontSize}}>{item.name}</ListItem.Title>
      </ListItem.Content>

      {item.checkbox ? (
        <ListItem.CheckBox
          checkedColor={GlobalStyles.checkbox.active}
          uncheckedColor={GlobalStyles.checkbox.inactive}
          checked={this.state[item.stateProperty]}
          onPress={() => this.listItemCheckboxOnPress(item)}
        />
      ) : null}
    </ListItem>
  );

  componentDidMount() {
    Storage.getBooleanItem(Globals.DARK_STYLE_ACTIVE).then((value) => this.setState({[Globals.DARK_STYLE_ACTIVE]: value}));

    Storage.getBooleanItem(Globals.FINGERPRINT_ACTIVE).then((value) => this.setState({[Globals.FINGERPRINT_ACTIVE]: value}));
  }

  render() {
    return (
      <View style={styles.listContainer}>
        <FlatList keyExtractor={(item, index) => index.toString()} data={listItems} renderItem={(item) => this.renderItem(item)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  listContainer: {
    borderBottomColor: 'rgba(113,113,113,0.51)',
    borderBottomWidth: 1,
    height: '100%',
    width: '98%',
  },
  listItemContainer: {
    backgroundColor: GlobalStyles.listItem.backgroundColor,
    marginBottom: 2,
  },
});
