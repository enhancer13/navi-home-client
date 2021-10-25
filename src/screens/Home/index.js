import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LiveStreaming from './LiveStreaming';
import Settings from './Settings';
import AlarmProfileEntityEditor from './Alarm';
import MyAccount from './MyAccount';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {DefaultNavigationBar} from '../../components';
import MediaGalleryNavigator from './MediaGallery';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DefaultSafeAreaView from '../../components/DefaultSafeAreaView';
import FirebaseMessageHandler from '../../components/ApplicationMessaging/FirebaseMessageHandler';

const Tab = createMaterialTopTabNavigator();
const iconSize = wp(6);

export default class Home extends Component {
  render() {
    return (
      <DefaultSafeAreaView>
        <FirebaseMessageHandler />
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
            label: {fontSize: GlobalStyles.defaultFontSize, textTransform: 'none', padding: 0, margin: 0},
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
            component={AlarmProfileEntityEditor}
            options={{
              tabBarIcon: ({color}) => <FontAwesome name="bell" color={color} size={iconSize} />,
            }}
          />
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
      </DefaultSafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
  },
});
