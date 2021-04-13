import React, {Component} from 'react';
import {Dimensions, Modal, Share, Text, View} from 'react-native';
import Globals from '../../../../globals/Globals';
import AuthService from '../../../../helpers/AuthService';
import MediaFileTypes from './MediaFileTypes';
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
      images: [],
      initialImageIndex: 0,
    };
  }

  onShare = async (image) => {
    const base64Data = await ajaxRequest.get(Globals.Endpoints.MediaGallery.IMAGE_BASE64(image.item), {headers: {Accept: 'text/plain'}});
    const shareOptions = {
      title: 'My Application',
      message: 'Use my application',
      url: `data:image/jpg;base64,${base64Data}`,
      subject: 'Share information from your application',
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
    const images = files
      .filter((item) => item.fileType === MediaFileTypes.IMAGE)
      .map((item) => {
        return {
          url: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.IMAGE(item)),
          width: item.width,
          height: item.height,
          thumbnail: {
            url: AuthService.buildFetchUrl(Globals.Endpoints.MediaGallery.IMAGE_THUMB(item)),
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
      images,
      initialImageIndex: images.findIndex((item) => item.item.id === nextProps.initialFile.id),
    };
  }

  renderHeader = (currentIndex) => {
    const currentImage = this.state.images[currentIndex].item;
    return (
      <View style={{justifyContent: 'center', height: 40, width: Dimensions.get('window').width, backgroundColor: 'rgba(135,105,255,0.4)'}}>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 15}}>{currentImage.fileName}</Text>
      </View>
    );
  };

  renderFooter = (currentIndex) => {
    const image = this.state.images[currentIndex];
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
          <TouchableScale>
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
    const {images, initialImageIndex} = this.state;
    return (
      <Modal visible={this.props.visible} transparent={true} onRequestClose={this.props.onRequestClose}>
        <ImageViewer
          imageUrls={images}
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
