import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthService from '../../../helpers/AuthService';
import * as Keychain from 'react-native-keychain';
import Storage from '../../../helpers/Storage';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Globals from '../../../globals/Globals';
import {GlobalStyles} from '../../../globals/GlobalStyles';
import {LoadingActivityIndicator} from '../../../components';
import AnimatedButton from '../../../components/AnimatedButton';
import DefaultText from '../../../components/DefaultText';
import DefaultTextInput from '../../../components/DefaultTextInput';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: '',
        password: '',
        serverName: '',
      },
      servers: {},
      loading: false,
      biometrySupported: false,
      biometryExercised: false,
      errorText: '',
    };
  }

  handleServerEdit = () => {
    const {
      servers,
      data: {serverName},
    } = this.state;
    if (servers.length > 0) {
      this.props.navigation.navigate('ServerConfig', {
        action: 'edit',
        server: servers.find((s) => s.serverName === serverName),
      });
    } else {
      this.setState({
        errorText: 'Nothing to edit.',
      });
    }
  };

  handleCredentialsChange = (key, value) => {
    this.setState({
      data: {...this.state.data, [key]: value},
    });
  };

  handleSuccessLogin = () => {
    this.setState({
      loading: false,
      errorText: '',
      data: {
        username: '',
        password: '',
        serverName: '',
      },
    });
    this.props.navigation.navigate('Home');
  };

  tryAutoBiometrySubmit = async () => {
    const {
      biometricSupport,
      data: {username, serverName},
    } = this.state;
    if (username && serverName) {
      const hasCredentials = await AuthService.hasCredentials(serverName, username);
      if (!this.state.biometryExercised && biometricSupport && hasCredentials) {
        await this.handleBiometrySubmit();
        this.setState({
          biometryExercised: true,
        });
      }
    }
  };

  handleBiometrySubmit = async () => {
    if (this.state.biometricSupport) {
      this.setState({
        loading: true,
      });
      let {serverName, username} = this.state.data;
      AuthService.tryBiometricAuthentication(serverName, username, this.props.navigation)
        .then(this.handleSuccessLogin)
        .catch((error) => {
          this.setState({
            errorText: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({
        errorText: 'Biometric authentication is not supported or not configured on this device, please login with your credentials.',
      });
    }
  };

  handleCredentialsSubmit = () => {
    let {username, password, serverName} = this.state.data;
    if (username.length === 0 || password.length === 0) {
      this.setState({
        errorText: 'Invalid login or password.',
      });
      return;
    }
    if (serverName.length === 0) {
      this.setState({
        errorText: 'Please configure the valid Orion server.',
      });
      return;
    }
    AuthService.tryCredentialsAuthentication(serverName, username, password, this.props.navigation)
      .then(this.handleSuccessLogin)
      .catch((error) => {
        this.setState({
          loading: false,
          errorText: error.message ? error.message : error,
        });
      });
    this.setState({
      loading: true,
    });
  };

  initializeData = async () => {
    const username = await Storage.getTextItem(Globals.Authorization.USERNAME);
    const servers = await Storage.getListItem(Globals.SERVERS);
    let serverName = await Storage.getTextItem(Globals.Authorization.SERVER_NAME);
    if (servers.length > 0 && (serverName.length === 0 || (serverName.length > 0 && !servers.some((s) => s.serverName === serverName)))) {
      serverName = servers[0].serverName;
    }
    const allowsBiometricAuth = (await Storage.getBooleanItem(Globals.FINGERPRINT_ACTIVE)) && (await Keychain.getSupportedBiometryType()) !== null;
    this.setState({
      data: {
        username: username,
        password: '',
        serverName: serverName,
      },
      biometricSupport: allowsBiometricAuth,
      servers: servers,
    });
  };

  componentDidMount() {
    this._onFocusUnsubscribe = this.props.navigation.addListener('focus', this.initializeData);
    this.initializeData();
  }

  componentWillUnmount() {
    this._onFocusUnsubscribe();
  }

  render() {
    const {
      data: {username, password, serverName},
      errorText,
      loading,
      servers,
      biometricSupport,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>Orion</Text>
        <View style={styles.formContainer}>
          <View style={styles.credentialsContainer}>
            <DefaultTextInput
              style={styles.credentialsInput}
              colorScheme={GlobalStyles.colorScheme.VIOLET}
              placeholder="Username"
              value={username}
              onChangeText={(value) => this.handleCredentialsChange('username', value)}
            />
            <DefaultTextInput
              style={styles.credentialsInput}
              colorScheme={GlobalStyles.colorScheme.VIOLET}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={(value) => this.handleCredentialsChange('password', value)}
            />
            <View style={styles.serverConfigContainer}>
              <Picker
                selectedValue={serverName}
                style={styles.serverPicker}
                mode={Picker.MODE_DROPDOWN}
                onValueChange={(itemValue, itemIndex) => this.handleCredentialsChange('serverName', itemValue, itemIndex)}>
                {Object.keys(servers).map((key) => {
                  return <Picker.Item label={servers[key].serverName} value={servers[key].serverName} key={key} />;
                })}
              </Picker>
              <TouchableOpacity style={styles.touchableIconContainer} onPress={this.handleServerEdit}>
                <FontAwesome name="edit" color={GlobalStyles.violetIconColor} size={iconSize} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableIconContainer}
                onPress={() =>
                  this.props.navigation.navigate('ServerConfig', {
                    action: 'add',
                  })
                }>
                <Entypo name="add-to-list" color={GlobalStyles.violetIconColor} size={iconSize} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: rowHeight}}>
            {loading ? (
              <LoadingActivityIndicator />
            ) : (
              <View style={styles.submitContainer}>
                <AnimatedButton containerStyle={styles.submitButton} onItemPress={this.handleCredentialsSubmit} text="SUBMIT" />
                {biometricSupport ? (
                  <TouchableOpacity style={styles.touchableIconContainer} onPress={this.handleBiometrySubmit}>
                    <Icon name="finger-print-outline" color={GlobalStyles.violetIconColor} size={iconSize} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        </View>
        <View style={styles.messageContainer}>
          <DefaultText numberOfLines={5} style={styles.messageText}>
            {errorText.length > 0 ? errorText : ''}
          </DefaultText>
        </View>
      </View>
    );
  }
}
const containerWidth = Math.min(wp('95%'), 500);
const iconSize = containerWidth * 0.08;
const rowHeight = containerWidth * 0.11;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: containerWidth,
  },
  credentialsContainer: {
    width: '90%',
  },
  credentialsInput: {
    borderRadius: 5,
    height: rowHeight,
    marginBottom: 5,
  },
  formContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(105,89,225,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    paddingBottom: '5%',
    paddingTop: '5%',
    width: '80%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  logoText: {
    color: 'rgba(105,89,225,0.5)',
    fontSize: containerWidth * 0.15,
    marginBottom: 50,
  },
  messageContainer: {
    height: hp(15),
    width: '80%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  messageText: {
    color: '#FF9F33',
    marginTop: 5,
    textAlign: 'center',
  },
  serverConfigContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serverPicker: {
    color: GlobalStyles.violetTextColor,
    flexGrow: 1,
    height: rowHeight,
  },
  submitButton: {
    flexBasis: '80%',
    flexGrow: 1,
    height: rowHeight,
    justifyContent: 'center',
  },
  submitContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: rowHeight,
    justifyContent: 'space-between',
    width: '90%',
  },
  touchableIconContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
});
