import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home';
import { AppState } from 'react-native';
import Storage from './src/helpers/Storage';
import { GlobalStyles } from './src/globals/GlobalStyles';
import Login from './src/screens/Login';
import ServerConfig from './src/screens/ServerConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';
import Orientation from 'react-native-orientation-locker';
import FlashMessage, { FlashMessageManager } from 'react-native-flash-message';
import SessionController from './src/helpers/SessionController';
import { navigationRef } from './src/helpers/RootNavigation';

const RootStackNavigator = createStackNavigator();
const screenOptions = {
  headerStyle: {
    backgroundColor: GlobalStyles.violetBackgroundColor,
  },
  headerTintColor: GlobalStyles.lightIconColor,
  headerTitleStyle: { color: GlobalStyles.lightTextColor },
  headerTitleAlign: 'center',
};

export default class App extends Component {
  state = {
    appState: AppState.currentState,
    initialized: false,
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    FlashMessageManager.setDisabled(nextAppState !== 'active');
    this.setState({ appState: nextAppState });
  };

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    try {
      Orientation.lockToPortrait();
    } catch (e) {
      console.error(e);
    }
    Storage.initializeStorage().then(() =>
      this.setState({ initialized: true })
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    if (!this.state.initialized) {
      return null;
    }
    return (
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStackNavigator.Navigator initialRouteName="Login">
            <RootStackNavigator.Screen
              name="Login"
              component={Login}
              options={screenOptions}
            />
            <RootStackNavigator.Screen
              name="ServerConfig"
              component={ServerConfig}
              options={screenOptions}
            />
            <RootStackNavigator.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          </RootStackNavigator.Navigator>
        </NavigationContainer>
        <SessionController />
        <FlashMessage position="bottom" />
      </SafeAreaProvider>
    );
  }
}
