import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthService from '../../../helpers/AuthService';
import * as Keychain from 'react-native-keychain';
import Storage from '../../../helpers/Storage';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {applicationConstants} from '../../../config/ApplicationConstants';
import {GlobalStyles} from '../../../config/GlobalStyles';
import {LoadingActivityIndicator} from '../../../components';
import AnimatedButton from '../../../components/AnimatedButton';
import TextInput from '../../../components/DefaultText';
import DefaultTextInput from '../../../components/DefaultTextInput';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {DropDownListPicker} from '../../../components/DropDownListPicker';


export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: '',
        password: '',
        serverName: '',
        servers: [],
      },
      loading: false,
      biometryActive: false,
      biometryType: null,
      biometryExercised: false,
      errorText: '',
    };
  }

  handleServerEdit = () => {
    const {
      data: {serverName, servers},
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

  handleFormDataChange = (key, value) => {
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
        servers: []
      },
    });
    this.props.navigation.navigate('Home');
  };

  tryAutoBiometrySubmit = async () => {
    const {
      biometryActive,
      data: {username, serverName},
    } = this.state;
    if (username && serverName) {
      const hasCredentials = await AuthService.hasCredentials(
        serverName,
        username,
      );
      if (!this.state.biometryExercised && biometryActive && hasCredentials) {
        await this.handleBiometrySubmit();
        this.setState({
          biometryExercised: true,
        });
      }
    }
  };

  handleBiometrySubmit = async () => {
    if (this.state.biometryActive) {
      this.setState({
        loading: true,
      });
      let {serverName, username} = this.state.data;
      AuthService.tryBiometricAuthentication(serverName, username)
        .then(this.handleSuccessLogin)
        .catch((error) => {
          this.setState({
            errorText: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({
        errorText:
          'Biometric authentication is not supported or not configured on this device, please login with your credentials.',
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
        errorText: 'Please configure the valid Navi Home server.',
      });
      return;
    }
    this.setState({loading: true})
    AuthService.tryCredentialsAuthentication(serverName, username, password)
      .then(this.handleSuccessLogin)
      .catch((error) => {
        this.setState({
          errorText: error.message ? error.message : error
        });
      }).finally(() => this.setState({loading: false}));
  };

  initializeData = async () => {
    const username = await Storage.getTextItem(applicationConstants.Authorization.USERNAME);
    const servers = await Storage.getListItem(applicationConstants.SERVERS);

    let serverName = await Storage.getTextItem(
      applicationConstants.Authorization.SERVER_NAME,
    );
    if (
      servers.length > 0 &&
      (serverName.length === 0 ||
        (serverName.length > 0 &&
          !servers.some((s) => s.serverName === serverName)))
    ) {
      serverName = servers[0].serverName;
    }
    const biometryType = await Keychain.getSupportedBiometryType();
    const biometryActive =
      (await Storage.getBooleanItem(applicationConstants.BIOMETRY_ACTIVE)) &&
      (biometryType) !== null;
    this.setState({
      data: {
        username,
        password: '',
        serverName,
        servers,
      },
      biometryActive,
      biometryType,
    });
  };

  componentDidMount() {
    this._onFocusUnsubscribe = this.props.navigation.addListener(
      'focus',
      this.initializeData,
    );
    this.initializeData();
  }

  componentWillUnmount() {
    this._onFocusUnsubscribe();
  }

  render() {
    const {
      data: {username, password, serverName, servers},
      errorText,
      loading,
      biometryActive,
      biometryType,
    } = this.state;
    const biometryIcon = (biometryType === Keychain.BIOMETRY_TYPE.FACE || biometryType === Keychain.BIOMETRY_TYPE.FACE_ID)
      ? (<MaterialCommunityIcon
        name="face-recognition"
        color={GlobalStyles.violetIconColor}
        size={iconSize}
      />)
      : (<Icon
        name="finger-print-outline"
        color={GlobalStyles.violetIconColor}
        size={iconSize}
      />);
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>Navi Home</Text>
        <View style={styles.formContainer}>
          <View style={styles.credentialsContainer}>
            <DefaultTextInput
              style={styles.credentialsInput}
              colorScheme={GlobalStyles.colorScheme.VIOLET}
              placeholder="Username"
              value={username}
              onChangeText={(value) =>
                this.handleFormDataChange('username', value)
              }
            />
            <DefaultTextInput
              style={styles.credentialsInput}
              colorScheme={GlobalStyles.colorScheme.VIOLET}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={(value) =>
                this.handleFormDataChange('password', value)
              }
            />
            <View style={styles.serverConfigContainer}>
              <DropDownListPicker
                items={servers.map(x => {
                  return {label: x.serverName, value: x.serverName};
                })}
                selectedItem={serverName}
                containerStyle={styles.serverPickerContainer}
                onItemChanged={(serverName) => this.handleFormDataChange('serverName', serverName)}/>
              <TouchableOpacity
                style={styles.touchableIconContainer}
                onPress={this.handleServerEdit}
              >
                <FontAwesome
                  name="edit"
                  color={GlobalStyles.violetIconColor}
                  size={iconSize}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableIconContainer}
                onPress={() =>
                  this.props.navigation.navigate('ServerConfig', {
                    action: 'add',
                  })
                }
              >
                <Entypo
                  name="add-to-list"
                  color={GlobalStyles.violetIconColor}
                  size={iconSize}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: rowHeight}}>
            {loading ? (
              <LoadingActivityIndicator/>
            ) : (
              <View style={styles.submitContainer}>
                <AnimatedButton
                  containerStyle={styles.submitButton}
                  onItemPress={this.handleCredentialsSubmit}
                  text="SUBMIT"
                />
                {biometryActive ? (
                  <TouchableOpacity
                    style={styles.touchableIconContainer}
                    onPress={this.handleBiometrySubmit}
                  >
                    {biometryIcon}
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        </View>
        <View style={styles.messageContainer}>
          <TextInput numberOfLines={5} style={styles.messageText}>
            {errorText.length > 0 ? errorText : ''}
          </TextInput>
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
  logoText: {
    color: 'rgba(105,89,225,0.5)',
    fontSize: containerWidth * 0.15,
    marginBottom: 50,
  },
  messageContainer: {
    height: hp(15),
    width: '80%',
  },
  messageText: {
    color: '#FF9F33',
    marginTop: 5,
    textAlign: 'center',
  },
  serverConfigContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  serverPickerContainer: {
    width: containerWidth * 0.5,
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
