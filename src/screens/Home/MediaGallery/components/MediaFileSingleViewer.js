import React, {Component} from 'react';
import {
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {backendEndpoints} from '../../../../config/BackendEndpoints';
import AuthService from '../../../../helpers/AuthService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ajaxRequest from '../../../../helpers/AjaxRequest';
import MediaViewer from '../../../../components/MediaViewer';
import {GlobalStyles} from '../../../../config/GlobalStyles';
import AnimatedPressableIcon from '../../../../components/AnimatedPressableIcon';
import FlexSafeAreaViewInsets from '../../../../components/View/FlexSafeAreaViewInsets';

const largeIconSize = hp(7);
const barHeight = largeIconSize / 1.5;
const iconSize = barHeight * 0.8;

export default class MediaFileSingleViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      initialImageIndex: 0,
    };
  }

  onShare = async (media) => {
    const limitedAccessLink = await ajaxRequest.get(
      backendEndpoints.MediaGallery.LIMITED_ACCESS_LINK(media.item),
      {
        headers: {Accept: 'text/plain'},
      },
    );
    const shareOptions = {
      title: `Sharing ${media.item.fileName}`,
      message: limitedAccessLink,
      url: '',
      subject: '',
    };
    try {
      const result = await Share.share(shareOptions);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
    }
  };

  static getDerivedStateFromProps(nextProps) {
    const files = [...nextProps.files];
    const headers = AuthService.getAuthorizationHeader();
    const media = files.map((item) => {
      return {
        url: AuthService.buildFetchUrl(
          backendEndpoints.MediaGallery.MEDIA(item),
        ),
        width: item.width,
        height: item.height,
        mediaType: item.fileType,
        thumbnail: {
          url: AuthService.buildFetchUrl(
            backendEndpoints.MediaGallery.MEDIA_THUMB(item),
          ),
        },
        props: {
          source: {
            headers: headers,
          },
        },
        item,
      };
    });
    return {
      media: media,
      initialImageIndex: media.findIndex(
        (item) => item.item.id === nextProps.initialFile.id,
      ),
    };
  }

  renderHeader = (currentIndex) => {
    const currentImage = this.state.media[currentIndex].item;
    return (
      <View style={styles.header}>
        <Text style={styles.headerInfoText} adjustsFontSizeToFit>
          {currentImage.fileName}
        </Text>
      </View>
    );
  };

  renderFooter = (currentIndex) => {
    const image = this.state.media[currentIndex];
    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => {
        }}>
          <MaterialCommunityIcons
            name="delete"
            color={GlobalStyles.whiteIconColor}
            size={iconSize}
          />
        </TouchableOpacity>
        <AnimatedPressableIcon
          onPress={() => this.onShare(image)}
          IconComponent={Entypo}
          iconName="share"
          iconColor={GlobalStyles.whiteIconColor}
          size={largeIconSize}
          backgroundColor={GlobalStyles.lightVioletColor}
          isRound={true}
        />
        <TouchableOpacity onPress={() => {
        }}>
          <AntDesign
            name="clouddownload"
            color={GlobalStyles.whiteIconColor}
            size={iconSize}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {media, initialImageIndex} = this.state;
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        onRequestClose={this.props.onRequestClose}
      >
        <FlexSafeAreaViewInsets>
          <MediaViewer
            mediaUrls={media}
            index={initialImageIndex}
            onSwipeDown={this.props.onRequestClose}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
            showThumbnails={true}
            enableSwipeDown={true}
            mediaZoomStyle={{backgroundColor: GlobalStyles.lightBackgroundColor}}
          />
        </FlexSafeAreaViewInsets>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    flexDirection: 'row',
    height: barHeight,
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: hp(1),
    paddingRight: hp(1),
    width: wp(100),
  },
  header: {
    backgroundColor: GlobalStyles.violetColor,
    height: hp(5),
    justifyContent: 'center',
    width: wp(100),
  },
  headerInfoText: {
    color: GlobalStyles.whiteTextColor,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
