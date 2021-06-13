import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LiveStreaming from './LiveStreaming';
import Settings from './Settings';
import Alarm from './Alarm';
import MyAccount from './MyAccount';
import messaging from '@react-native-firebase/messaging';
import AuthService from '../../helpers/AuthService';
import {Overlay, Divider, Text} from 'react-native-elements';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {DefaultNavigationBar} from '../../components';
import MediaGalleryNavigator from './MediaGallery';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DefaultSafeAreaView from '../../components/DefaultSafeAreaView';

const Tab = createMaterialTopTabNavigator();
const iconSize = wp(6);

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlay: {
        visible: false,
        message: 'test message',
        title: 'My title',
      },
    };
  }

  firebaseInit() {
    messaging()
      .getToken()
      .then((clientToken) => AuthService.updateFirebaseClientToken(clientToken))
      .catch((error) => {
        console.log(error);
      });

    try {
      messaging().onTokenRefresh((clientToken) => AuthService.updateFirebaseClientToken(clientToken));
    } catch (e) {
      console.log('Unable to update client token.');
    }

    this.firebaseMessageListener = messaging().onMessage((remoteMessage) => {
      if (remoteMessage.notification) {
        this.setOverlayMessage(remoteMessage);
        console.log('Message handled in the foreground!', remoteMessage.notification);
      }
    });
  }

  toggleOverlay = () => {
    this.setState({
      overlay: {...this.state.overlay, visible: !this.state.overlay.visible},
    });
  };

  setOverlayMessage = (remoteMessage) => {
    this.setState({
      overlay: {
        ...this.state.overlay,
        visible: true,
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
      },
    });
  };

  componentWillUnmount() {
    this.firebaseMessageListener();
  }

  componentDidMount() {
    this.firebaseInit();
    // Check whether an application is opened by notification from quite state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      this.setOverlayMessage(remoteMessage);
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          this.setOverlayMessage(remoteMessage);
        }
      });
  }

  render() {
    return (
      <DefaultSafeAreaView>
        <DefaultNavigationBar />
        <Tab.Navigator
          initialRouteName="Live"
          swipeEnabled={false}
          tabBarPosition="bottom"
          scrollEnabled={true}
          tabBarOptions={{
            activeTintColor: GlobalStyles.violetColor,
            inactiveTintColor: GlobalStyles.lightGreyColor,
            pressColor: GlobalStyles.lightVioletColor,
            showIcon: true,
            labelStyle: {fontSize: GlobalStyles.defaultFontSize, textTransform: 'none', padding: 0, margin: 0},
            iconStyle: {
              height: hp(6),
              width: hp(6),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              margin: 0,
            },
            tabStyle: {
              height: hp(12),
              width: wp(20),
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: 0,
              margin: 0,
            },
            style: styles.barStyle,
          }}>
          <Tab.Screen
            name="Live Streaming"
            component={LiveStreaming}
            options={{
              tabBarIcon: ({focused, color}) => <FontAwesome name="video-camera" focused={focused} color={color} size={iconSize} />,
            }}
          />
          <Tab.Screen
            name="Media Gallery"
            component={MediaGalleryNavigator}
            options={{
              tabBarIcon: ({color}) => <Ionicons name="images" color={color} size={iconSize} />,
            }}
          />
          <Tab.Screen
            name="Alarm Settings"
            component={Alarm}
            options={{
              tabBarIcon: ({color}) => <FontAwesome name="bell" color={color} size={iconSize} />,
            }}
          />
          {/*<Tab.Screen*/}
          {/*  name="Devices"*/}
          {/*  component={Devices}*/}
          {/*  options={{*/}
          {/*    tabBarIcon: ({color}) => <MaterialCommunityIcons name="devices" color={color} size={iconSize} />,*/}
          {/*  }}*/}
          {/*/>*/}
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarIcon: ({color}) => <Ionicons name="ios-settings" color={color} size={iconSize} />,
            }}
          />
          <Tab.Screen
            name="My Account"
            component={MyAccount}
            options={{
              tabBarIcon: ({color}) => <FontAwesome name="user" color={color} size={iconSize} />,
            }}
          />
        </Tab.Navigator>
        <View>
          <Overlay overlayStyle={styles.overlay} isVisible={this.state.overlay.visible} onBackdropPress={this.toggleOverlay}>
            <View>
              <Text h4 style={styles.overlayHeader}>
                {this.state.overlay.title}
              </Text>
              <Divider />
              <Text>{this.state.overlay.message}</Text>
            </View>
          </Overlay>
        </View>
      </DefaultSafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
  },
  overlay: {
    alignItems: 'stretch',
    flexDirection: 'column',
    height: '60%',
    justifyContent: 'flex-start',
    width: '90%',
  },
  overlayHeader: {
    textAlign: 'center',
  },
});
