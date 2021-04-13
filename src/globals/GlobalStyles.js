import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const GlobalStyles = {
  colorScheme: {
    VIOLET: 'violet',
    BLACK: 'black',
  },
  defaultFontSize: hp(1.8),

  violetBackgroundColor: '#6959d5',
  lightBackgroundColor: '#f1f1f1',

  whiteTextColor: 'white',
  blackTextColor: 'black',
  violetTextColor: '#6959d5',
  lightVioletTextColor: 'rgba(135,105,255,0.4)',
  greyTextColor: 'grey',

  whiteIconColor: 'white',
  violetIconColor: '#6959d5',

  violetColor: '#6959d5',
  lightVioletColor: 'rgba(135,105,255,0.4)',

  containerNoPadding: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f1f1f1',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
  navigationBar: {
    backgroundColor: '#ebebeb',
    activeTintColor: '#6959d5',
    inactiveTintColor: '#abacc3',
    pressColor: '#6d6e85',
    barStyle: {
      backgroundColor: '#ebebeb',
    },
  },
  navigationHeader: {
    color: '#f1f1f1',
    backgroundColor: '#6959d5',
  },
  statusBar: {
    backgroundColor: '#6959d5',
    barStyle: 'light-content',
  },
  listItem: {
    backgroundColor: '#efefef',
    textColor: 'black',
  },
  switch: {
    trackColorActive: '#6959d5',
    trackColorInactive: 'white',
    thumbColorActive: 'white',
    thumbColorInactive: '#b4b5cb',
  },
  checkbox: {
    active: '#6959d5',
    inactive: '#b4b5cb',
  },
};

export {GlobalStyles};
