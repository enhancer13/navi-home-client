import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LiveStreaming from './LiveStreaming';
import Settings from './Settings';
import AlarmProfileEntityEditor from './Alarm';
import MyAccount from './MyAccount';
import {GlobalStyles} from '../../config/GlobalStyles';
import {DefaultNavigationBar} from '../../components';
import MediaGalleryNavigator from './MediaGallery';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FirebaseMessageHandler from '../../components/ApplicationMessaging/FirebaseMessageHandler';
import FlexSafeAreaView from '../../components/View/FlexSafeAreaView';

const Tab = createBottomTabNavigator();
const iconSize = wp(6);

const Home = () => {
  return (
    <FlexSafeAreaView ignoreBottomInsets={true}>
      <FirebaseMessageHandler/>
      <DefaultNavigationBar/>
      <Tab.Navigator
        initialRouteName="Live"
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
          tabBarActiveTintColor: GlobalStyles.violetColor,
          tabBarInactiveTintColor: GlobalStyles.lightGreyColor,
          tabBarPressColor: GlobalStyles.lightVioletColor,
          tabBarShowIcon: true,
          label: {
            fontSize: GlobalStyles.defaultFontSize,
            textTransform: 'none',
            padding: 0,
            margin: 0,
          },
          tabBarStyle: styles.barStyle,

        }}
        tabBarPosition="bottom"
        scrollEnabled={true}
      >
        <Tab.Screen
          name="Live Streaming"
          component={LiveStreaming}
          options={{
            tabBarIcon: ({focused, color}) => (
              <FontAwesome name="video-camera" focused={focused} color={color} size={iconSize}/>
            ),
          }}
        />
        <Tab.Screen
          name="Media Gallery"
          component={MediaGalleryNavigator}
          options={{
            tabBarIcon: ({color}) => <Ionicons name="images" color={color} size={iconSize}/>,
          }}
        />
        <Tab.Screen
          name="Alarm Settings"
          component={AlarmProfileEntityEditor}
          options={{
            tabBarIcon: ({color}) => <FontAwesome name="bell" color={color} size={iconSize}/>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="ios-settings" color={color} size={iconSize}/>
            ),
          }}
        />
        <Tab.Screen
          name="My Account"
          component={MyAccount}
          options={{
            tabBarIcon: ({color}) => <FontAwesome name="user" color={color} size={iconSize}/>,
          }}
        />
      </Tab.Navigator>
    </FlexSafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: GlobalStyles.lightBackgroundColor
  },
});
