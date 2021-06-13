import React, {Component} from 'react';
import {Dimensions, Modal, Share, Text, View} from 'react-native';
import Globals from '../../../../globals/Globals';
import AuthService from '../../../../helpers/AuthService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchableScale from 'react-native-touchable-scale';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ajaxRequest from '../../../../helpers/AjaxRequest';
import ImageViewer from '../../../../components/ImageViewer';

const barHeight = hp(5);
const iconSize = barHeight * 0.8;
const iconColor = '#6959d5';

export default class MediaFileSingleViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      initialImageIndex: 0,
    };
  }

  onShare = async (media) => {
    const limitedAccessLink = await ajaxRequest.get(Globals.Endpoints.MediaGallery.LIMITED_ACCESS_LINK(media.item), {
      headers: {Accept: 'text/plain'},
    });
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
    } catch (error) {}
  };

  static getDerivedStateFromProps(nextProps) {
    const files = [...nextProps.files];
    const headers = AuthService.getAuthorizationHeader();
    const media = files.map((item) => {
      return {
        url: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.MEDIA(item)),
        width: item.width,
        height: item.height,
        mediaType: item.fileType,
        thumbnail: {
          url: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.MEDIA_THUMB(item)),
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
      initialImageIndex: media.findIndex((item) => item.item.id === nextProps.initialFile.id),
    };
  }

  renderHeader = (currentIndex) => {
    const currentImage = this.state.media[currentIndex].item;
    return (
      <View style={{justifyContent: 'center', height: 40, width: Dimensions.get('window').width, backgroundColor: 'rgba(135,105,255,0.4)'}}>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 15}}>{currentImage.fileName}</Text>
      </View>
    );
  };

  renderFooter = (currentIndex) => {
    const image = this.state.media[currentIndex];
    return (
      <View style={{width: wp(100)}}>
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            width: wp(70),
            justifyContent: 'space-around',
            borderRadius: 5,
            //alignContent: 'space-around',
            backgroundColor: 'rgba(135,105,255,0.15)',
            marginBottom: 40,
          }}>
          <TouchableScale>
            <MaterialCommunityIcons name="delete" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale onPress={() => this.onShare(image)}>
            <Entypo name="share" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale>
            <AntDesign name="clouddownload" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
      </View>
    );
  };

  render() {
    const {media, initialImageIndex} = this.state;
    return (
      <Modal visible={this.props.visible} transparent={true} onRequestClose={this.props.onRequestClose}>
        <ImageViewer
          imageUrls={media}
          index={initialImageIndex}
          onSwipeDown={this.props.onRequestClose}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          showThumbnails={true}
          enableSwipeDown={true}
        />
      </Modal>
    );
  }
}
