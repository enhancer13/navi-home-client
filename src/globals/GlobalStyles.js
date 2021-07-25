import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const GlobalStyles = {
  //Predefined UI Elements color scheme with complex colors - DefaultTextInput
  colorScheme: {
    VIOLET: 'violet',
    BLACK: 'black',
  },
  smallFontSize: hp(1.4),
  defaultFontSize: hp(1.8),
  defaultTitleFontSize: hp(2.4),

  //Text Colors
  whiteTextColor: 'white',
  lightTextColor: '#f1f1f1',
  greyTextColor: 'grey',
  blackTextColor: 'black',
  lightVioletTextColor: 'rgba(135,105,255,0.4)',
  violetTextColor: '#6959d5',

  //Container Colors
  whiteBackgroundColor: 'white',
  violetBackgroundColor: '#6959d5',
  lightBackgroundColor: '#f1f1f1',
  orangeBackgroundColor: '#f8c64e',
  blueBackgroundColor: '#a1cbff',
  greyBackgroundColor: 'grey',
  lightGreyBackgroundColor: '#abacc3',

  //Icon Colors
  whiteIconColor: 'white',
  lightIconColor: '#f1f1f1',
  violetIconColor: '#6959d5',
  transparentIconColor: 'transparent',

  //Colors of other UI elements
  violetColor: '#6959d5',
  lightVioletColor: '#a79efc',
  softLightVioletColor: '#edecff',
  greyColor: 'grey',
  lightGreyColor: '#abacc3',
};

export {GlobalStyles};
