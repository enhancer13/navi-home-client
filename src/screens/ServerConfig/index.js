import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Storage from '../../helpers/Storage';
import ajaxRequest from '../../helpers/AjaxRequest';
import Globals from '../../globals/Globals';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {DefaultNavigationBar} from '../../components';
import {LoadingActivityIndicator} from '../../components';
import DefaultSafeAreaView from '../../components/DefaultSafeAreaView';
import DefaultText from '../../components/DefaultText';
import AnimatedPressable from '../../components/AnimatedPressable';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DefaultTextInput from '../../components/DefaultTextInput';

const serverActionsEnum = Object.freeze({
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  TEST: 'test',
});

export default class ServerConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverName: '',
      serverAddress: 'https://',
      errorText: '',
      loading: false,
    };
  }

  handleServerChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleServerActions = async (action) => {
    const {serverName, serverAddress} = this.state;
    if (serverName.length === 0 || serverName.length === 0) {
      this.setState({
        errorText: "Server name or address couldn't be empty.",
      });
      return;
    }
    const server = {
      serverName: serverName,
      serverAddress: serverAddress,
    };
    const {navigation} = this.props;
    switch (action) {
      case serverActionsEnum.ADD:
        let servers = await Storage.getListItem(Globals.SERVERS);
        if (servers.some((s) => s.serverName === serverName)) {
          this.setState({
            errorText: `Unable to save server configuration, cause server name: ${serverName} already exists.`,
          });
          return;
        }
        await Storage.addListItem(Globals.SERVERS, server);
        navigation.navigate('Login', {loading: false});
        break;
      case serverActionsEnum.EDIT:
        await Storage.updateListItem(Globals.SERVERS, server, 'serverName', this.props.route.params.server.serverName);
        navigation.navigate('Login', {loading: false});
        break;
      case serverActionsEnum.DELETE:
        await Storage.removeListItem(Globals.SERVERS, this.props.route.params.server.serverName, 'serverName');
        navigation.navigate('Login', {loading: false});
        break;
      case serverActionsEnum.TEST:
        let msg;
        try {
          this.setState({
            loading: true,
          });
          let {name, version, build} = await ajaxRequest.get(serverAddress + Globals.Endpoints.APPLICATION_INFO, {skipAuthorization: true});
          msg = name + '\nversion: ' + version + '\nbuild: ' + build;
        } catch (error) {
          msg = error.message;
        }
        this.setState({
          errorText: msg,
          loading: false,
        });
        break;
      default:
        throw new Error('Unsupported server action: ' + action);
    }
  };

  initializeState = () => {
    const {server} = this.props.route.params;
    this.setState({
      serverName: server ? server.serverName : '',
      serverAddress: server ? server.serverAddress : 'https://',
    });
  };

  componentDidMount() {
    this.initializeState();
    this._onFocusUnsubscribe = this.props.navigation.addListener('focus', this.initializeState);
  }

  componentWillUnmount() {
    this._onFocusUnsubscribe();
  }

  render() {
    const {errorText, serverName, serverAddress, loading} = this.state;
    const {action} = this.props.route.params;
    return (
      <DefaultSafeAreaView>
        <DefaultNavigationBar />
        <View style={styles.container}>
          <View style={styles.serverInputContainer}>
            {/* eslint-disable-next-line react-native/no-raw-text */}
            <DefaultText>{'Please enter the valid Orion server address.\n\nExample:\nhttps://127.0.0.1:9000\n'}</DefaultText>
            <DefaultTextInput
              style={styles.textInput}
              placeholder="Server name"
              colorScheme={GlobalStyles.colorScheme.BLACK}
              value={serverName}
              onChangeText={(value) => this.handleServerChange('serverName', value)}
            />
            <DefaultTextInput
              style={styles.textInput}
              placeholder="Server address"
              colorScheme={GlobalStyles.colorScheme.BLACK}
              value={serverAddress}
              onChangeText={(value) => this.handleServerChange('serverAddress', value)}
            />
            {loading ? (
              <LoadingActivityIndicator />
            ) : (
              <View style={styles.messageContainer}>
                <DefaultText numberOfLines={5} style={styles.messageText}>
                  {errorText.length > 0 ? errorText : ''}
                </DefaultText>
              </View>
            )}
          </View>
          <View style={styles.actionsContainer}>
            <AnimatedPressable onItemPress={() => this.handleServerActions(serverActionsEnum.TEST)} text="Test connection" />
            <View style={styles.rightButtonGroup}>
              {action === serverActionsEnum.EDIT ? (
                <AnimatedPressable onItemPress={() => this.handleServerActions(serverActionsEnum.DELETE)} text="Delete" />
              ) : null}
              <AnimatedPressable
                containerStyle={{marginLeft: wp(2)}}
                onItemPress={() => this.handleServerActions(action)}
                text={action === serverActionsEnum.ADD ? 'Save' : 'Update'}
              />
            </View>
          </View>
        </View>
      </DefaultSafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  actionsContainer: {
    alignItems: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    width: '90%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  messageText: {
    color: '#FF9F33',
    marginTop: 5,
    textAlign: 'center',
  },
  rightButtonGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  serverInputContainer: {
    flex: 0.9,
    marginTop: 20,
    width: '90%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  textInput: {
    borderBottomColor: '#c5c5c5',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
