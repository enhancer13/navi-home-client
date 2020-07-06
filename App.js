import React, {Component} from 'react';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import {Router, Stack, Scene} from 'react-native-router-flux';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="login" component={Login} initial={true} />
          <Scene key="home" component={Home} />
        </Stack>
      </Router>
    );
  }
}
