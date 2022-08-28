import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Storage from '../../helpers/Storage';
import ajaxRequest from '../../helpers/AjaxRequest';
import {applicationConstants} from '../../config/ApplicationConstants';
import { GlobalStyles } from '../../config/GlobalStyles';
import { DefaultNavigationBar } from '../../components';
import TextInput from '../../components/DefaultText';
import DefaultTextInput from '../../components/DefaultTextInput';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedPressableIcon from '../../components/AnimatedPressableIcon';
import FlexSafeAreaView from '../../components/View/FlexSafeAreaView';
import {
  showSuccess,
  showError,
} from '../../components/ApplicationMessaging/Popups';
import {backendEndpoints} from '../../config/BackendEndpoints';

const iconSize = hp(5);

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
      loading: false,
    };
  }

  handleServerChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleServerActions = async (action) => {
    const { serverName, serverAddress } = this.state;
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
    const { navigation } = this.props;
    switch (action) {
      case serverActionsEnum.ADD:
        let servers = await Storage.getListItem(applicationConstants.SERVERS);
        if (servers.some((s) => s.serverName === serverName)) {
          showError(
            `Unable to save server configuration, cause server name: ${serverName} already exists.`
          );
          return;
        }
        await Storage.addListItem(applicationConstants.SERVERS, server);
        navigation.navigate('Login', { loading: false });
        break;
      case serverActionsEnum.EDIT:
        await Storage.updateListItem(
          applicationConstants.SERVERS,
          server,
          'serverName',
          this.props.route.params.server.serverName
        );
        navigation.navigate('Login', { loading: false });
        break;
      case serverActionsEnum.DELETE:
        await Storage.removeListItem(
          applicationConstants.SERVERS,
          this.props.route.params.server.serverName,
          'serverName'
        );
        navigation.navigate('Login', { loading: false });
        break;
      case serverActionsEnum.TEST:
        try {
          this.setState({
            loading: true,
          });
          const { name, version, build } = await ajaxRequest.get(
            serverAddress + backendEndpoints.APPLICATION_INFO,
            { skipAuthorization: true }
          );
          showSuccess(name + '\nversion: ' + version + '\nbuild: ' + build);
        } catch (error) {
          showError(error.message);
        }
        this.setState({
          loading: false,
        });
        break;
      default:
        throw new Error('Unsupported server action: ' + action);
    }
  };

  initializeState = () => {
    const { server } = this.props.route.params;
    this.setState({
      serverName: server ? server.serverName : '',
      serverAddress: server ? server.serverAddress : 'https://',
    });
  };

  componentDidMount() {
    this.initializeState();
    this._onFocusUnsubscribe = this.props.navigation.addListener(
      'focus',
      this.initializeState
    );
  }

  componentWillUnmount() {
    this._onFocusUnsubscribe();
  }

  render() {
    const { serverName, serverAddress, loading } = this.state;
    const { action } = this.props.route.params;
    return (
      <FlexSafeAreaView ignoreTopInsets={true}>
        <DefaultNavigationBar />
        <View style={styles.container}>
          <View style={styles.serverInputContainer}>
            <TextInput>
              {
                'Please enter the valid Navi Home server address.\n\nExample:\nhttps://127.0.0.1:9000\n'
              }
            </TextInput>
            <DefaultTextInput
              style={styles.textInput}
              placeholder="Server name"
              colorScheme={GlobalStyles.colorScheme.BLACK}
              value={serverName}
              onChangeText={(value) =>
                this.handleServerChange('serverName', value)
              }
            />
            <DefaultTextInput
              style={styles.textInput}
              placeholder="Server address"
              colorScheme={GlobalStyles.colorScheme.BLACK}
              value={serverAddress}
              onChangeText={(value) =>
                this.handleServerChange('serverAddress', value)
              }
            />
          </View>
        </View>
        <View style={styles.controlPanel}>
          <TouchableOpacity
            onPress={() => this.handleServerActions(serverActionsEnum.DELETE)}
          >
            <MaterialCommunityIcons
              name="delete"
              color={GlobalStyles.whiteIconColor}
              size={iconSize}
            />
          </TouchableOpacity>
          <AnimatedPressableIcon
            onPress={() => this.handleServerActions(serverActionsEnum.TEST)}
            IconComponent={MaterialIcons}
            iconName="verified-user"
            iconColor={GlobalStyles.whiteIconColor}
            size={2 * iconSize}
            backgroundColor={GlobalStyles.lightVioletColor}
            isRound={true}
            isBusy={loading}
          />
          <TouchableOpacity onPress={() => this.handleServerActions(action)}>
            <Entypo
              name="save"
              color={GlobalStyles.whiteIconColor}
              size={iconSize}
            />
          </TouchableOpacity>
        </View>
      </FlexSafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  controlPanel: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    flexDirection: 'row',
    height: iconSize * 1.2,
    justifyContent: 'space-between',
    paddingLeft: hp(1),
    paddingRight: hp(1),
  },
  serverInputContainer: {
    flex: 0.9,
    marginTop: 20,
    width: '90%',
  },
  textInput: {
    borderBottomColor: '#c5c5c5',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
