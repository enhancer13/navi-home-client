import { TextStyle, ViewStyle } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default (
  width: number,
  height: number,
  backgroundColor: string
): {
  [x: string]: ViewStyle | TextStyle;
} => {
  return {
    modalContainer: {
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    watchOrigin: {
      position: 'absolute',
      width,
      bottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    watchOriginTouchable: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 30,
      borderColor: 'white',
      borderWidth: 0.5,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    watchOriginText: { color: 'white', backgroundColor: 'transparent' },
    imageStyle: {},
    container: { backgroundColor },
    moveBox: { flexDirection: 'row', alignItems: 'center' },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowLeftContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      zIndex: 13,
    },
    arrowRightContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      zIndex: 13,
    },
    headerContainer: {
      top: 0,
      overflow: 'hidden',
      width: wp(100),
      height: hp(5),
      justifyContent: 'flex-start',
      position: 'absolute',
      zIndex: 9,
    },
    footerContainer: {
      bottom: 0,
      overflow: 'hidden',
      width: wp(100),
      height: hp(7),
      justifyContent: 'flex-end',
      position: 'absolute',
      zIndex: 9,
    },
    thumbnailsContainer: {
      width: wp(100),
      bottom: hp(7),
      position: 'absolute',
      zIndex: 9,
    },
    thumbnailsFlatList: {
      alignSelf: 'center',
    },
    thumbnailImageSelected: {
      borderColor: 'rgb(135,105,255)',
    },
    thumbnailImage: {
      height: hp(6),
      width: hp(6),
      borderWidth: hp(0.3),
      borderRadius: hp(1),
      borderColor: 'transparent',
    },
  };
};

export const simpleStyle: {
  [x: string]: ViewStyle | TextStyle;
} = {
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: hp(5),
    zIndex: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  countText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 0,
      height: 0.5,
    },
    textShadowRadius: 0,
  },
};
