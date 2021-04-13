import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/screens/Home';
import {AppState, Platform, SafeAreaView, StyleSheet} from 'react-native';
import Storage from './src/helpers/Storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {GlobalStyles} from './src/globals/GlobalStyles';
import Login from './src/screens/Login';
import ServerConfig from './src/screens/ServerConfig';
import {SafeAreaProvider} from 'react-native-safe-area-context/src/SafeAreaContext';

const RootStackNavigator = createStackNavigator();
const screenOptions = {
  headerStyle: {
    backgroundColor: GlobalStyles.navigationHeader.backgroundColor,
  },
  headerTintColor: GlobalStyles.navigationHeader.color,
  headerTitleStyle: {color: GlobalStyles.navigationHeader.color},
  headerTitleAlign: 'center',
};

export default class App extends Component {
  state = {
    appState: AppState.currentState,
    initialized: false,
  };

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }
    this.setState({appState: nextAppState});
  };

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    } catch (e) {
      console.error(e);
    }
    Storage.initializeStorage().then(() => this.setState({initialized: true}));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          {this.state.initialized ? (
            <RootStackNavigator.Navigator initialRouteName="Login">
              <RootStackNavigator.Screen name="Login" component={Login} options={screenOptions} />
              <RootStackNavigator.Screen name="ServerConfig" component={ServerConfig} options={screenOptions} />
              <RootStackNavigator.Screen name="Home" component={Home} options={{headerShown: false}} />
            </RootStackNavigator.Navigator>
          ) : null}
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
