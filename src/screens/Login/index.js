import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { Animated, StyleSheet } from 'react-native';
import { DefaultNavigationBar } from '../../components';
import DefaultSafeAreaView from '../../components/DefaultSafeAreaView';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const backgroundIcons = [
  {
    image: require('./Images/auto_watering.png'),
    style: {
      top: '12%',
      left: '10%',
    },
    delay: 100,
    property: 'auto_watering',
  },
  {
    image: require('./Images/plants_care.png'),
    style: {
      top: '10%',
      left: '75%',
    },
    delay: 900,
    property: 'plants_care',
  },
  {
    image: require('./Images/smart_lamp.png'),
    style: {
      top: '20%',
      left: '40%',
    },
    delay: 400,
    property: 'smart_lamp',
  },
  {
    image: require('./Images/smart_sensors.png'),
    style: {
      top: '65%',
      left: '5%',
    },
    delay: 800,
    property: 'smart_sensors',
  },
  {
    image: require('./Images/remote_control.png'),
    style: {
      top: '45%',
      left: '45%',
    },
    delay: 300,
    property: 'remote_control',
  },
  {
    image: require('./Images/smart_lock.png'),
    style: {
      top: '60%',
      left: '80%',
    },
    delay: 700,
    property: 'smart_lock',
  },
  {
    image: require('./Images/smart_socket.png'),
    style: {
      top: '30%',
      left: '70%',
    },
    delay: 500,
    property: 'smart_socket',
  },
  {
    image: require('./Images/smoke_sensor.png'),
    style: {
      top: '35%',
      left: '10%',
    },
    delay: 600,
    property: 'smoke_sensor',
  },
  {
    image: require('./Images/temp_sensor.png'),
    style: {
      top: '80%',
      left: '45%',
    },
    delay: 200,
    property: 'temp_sensor',
  },
];

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
    this.loginFormAnimationValue = new Animated.Value(0);
    backgroundIcons.forEach((data) => {
      this[data.property] = new Animated.Value(0);
    });
    this.animatedImages = backgroundIcons.map((data, index) => {
      return (
        <Animated.Image
          key={index}
          source={data.image}
          style={[
            styles.animatedImageContainer,
            data.style,
            {
              opacity: this[data.property],
            },
          ]}
        />
      );
    });
  }

  loadingAnimation = () => {
    backgroundIcons.forEach((data) => {
      this[data.property].setValue(0);
      Animated.sequence([
        Animated.delay(data.delay),
        Animated.timing(this[data.property], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this[data.property], {
          toValue: 0.45,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
    this.loginFormAnimationValue.setValue(0);
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(this.loginFormAnimationValue, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.form && this.form.tryAutoBiometrySubmit();
    });
  };

  componentDidMount() {
    this._onFocusUnsubscribe = this.props.navigation.addListener(
      'focus',
      () => {
        if (!this.state.initialized) {
          this.loadingAnimation();
          this.setState({ initialized: true });
        }
      }
    );
  }

  componentWillUnmount() {
    this._onFocusUnsubscribe();
  }

  render() {
    return (
      <DefaultSafeAreaView>
        <DefaultNavigationBar />
        {this.animatedImages}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: this.loginFormAnimationValue,
              transform: [{ scale: this.loginFormAnimationValue }],
            },
          ]}
        >
          <LoginForm
            ref={(form) => {
              this.form = form;
            }}
            {...this.props}
          />
        </Animated.View>
      </DefaultSafeAreaView>
    );
  }
}
const iconSize = Math.min(80, wp(11));
const styles = StyleSheet.create({
  animatedImageContainer: {
    height: iconSize,
    position: 'absolute',
    resizeMode: 'contain',
    width: iconSize,
  },
  formContainer: {
    alignSelf: 'center',
    bottom: 0,
    position: 'absolute',
  },
});
