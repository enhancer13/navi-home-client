import { ImageStyle, StyleProp } from 'react-native';

export interface IBackgroundIcon {
  image: any;
  style: StyleProp<ImageStyle>;
  delay: number;
  property: string;
}

const backgroundIcons: IBackgroundIcon[] = [
  {
    image: require('./Images/auto_watering.png'),
    style: {
      top: '2%',
      left: '10%',
    },
    delay: 100,
    property: 'auto_watering',
  },
  {
    image: require('./Images/plants_care.png'),
    style: {
      top: '0%',
      left: '75%',
    },
    delay: 900,
    property: 'plants_care',
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
    image: require('./Images/smart_lamp.png'),
    style: {
      top: '60%',
      left: '80%',
    },
    delay:700,
    property: 'smart_lamp',
  },
  {
    image: require('./Images/remote_control.png'),
    style: {
      top: '50%',
      left: '45%',
    },
    delay: 300,
    property: 'remote_control',
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

export default backgroundIcons;
