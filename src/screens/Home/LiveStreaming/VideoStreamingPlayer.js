import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AjaxRequest from '../../../helpers/AjaxRequest';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GlobalStyles } from '../../../config/GlobalStyles';
import VideoPlayer from '../../../components/VideoPlayer';
import PropTypes from 'prop-types';
import { LoadingActivityIndicator } from '../../../components';
import {backendEndpoints} from '../../../config/BackendEndpoints';

const videoAspectRatio = 16 / 9;
const playerControlsHeight = (0.08 * wp(100)) / videoAspectRatio;
const iconSize = playerControlsHeight * 0.9;
const appServicesEnum = Object.freeze({
  PRODUCER: 'producer',
  VIDEO_RECORDER: 'video-recorder',
  MOTION_DETECTOR: 'motion-detector',
});

export default class VideoStreamingPlayer extends Component {
  toggleAppService = async (service, currentState) => {
    await AjaxRequest.put(
      backendEndpoints.Services.APPLICATION_SERVICE_ACTION(
        service,
        this.props.videoSource.id,
        currentState
      ),
      null,
      {
        skipResponse: true,
      }
    );
  };

  renderControl(children, callback, style = {}) {
    return (
      <TouchableOpacity
        underlayColor="transparent"
        activeOpacity={0.3}
        onPress={() => {
          callback && callback();
        }}
        style={[styles.player.control, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  renderBottomControls() {
    const {
      framesProducerActive,
      videoRecorderActive,
      motionDetectorActive,
      framesProducerConnectionError,
    } = this.props.videoSource.servicesStatus;
    const motionDetectorControl = (
      <MaterialCommunityIcons
        name={motionDetectorActive ? 'motion-sensor' : 'motion-sensor-off'}
        color={motionDetectorActive ? 'white' : '#2d2d67'}
        size={iconSize}
      />
    );
    const videoRecordingControl = (
      <Ionicons
        name="ios-recording-outline"
        color={videoRecorderActive ? 'white' : '#2d2d67'}
        size={iconSize}
      />
    );
    const cameraConnectionStatus = (
      <AntDesign
        name="disconnect"
        color={framesProducerConnectionError ? '#b81ac5' : '#2d2d67'}
        size={iconSize}
      />
    );
    const cameraControl = (
      <Ionicons
        name="ios-power"
        color={framesProducerActive ? 'white' : '#2d2d67'}
        size={iconSize}
      />
    );
    return (
      <LinearGradient
        colors={['#6a5aeb', '#6959e1', '#383873']}
        style={styles.player.controls}
      >
        <View style={styles.player.info}>
          <Text style={styles.player.infoText} adjustsFontSizeToFit>
            {this.props.videoSource.name}
          </Text>
        </View>
        <View style={styles.player.controlsGroup}>
          {this.renderControl(motionDetectorControl, () =>
            this.toggleAppService(
              appServicesEnum.MOTION_DETECTOR,
              motionDetectorActive
            )
          )}
          {this.renderControl(cameraConnectionStatus)}
          {this.renderControl(videoRecordingControl, () =>
            this.toggleAppService(
              appServicesEnum.VIDEO_RECORDER,
              videoRecorderActive
            )
          )}
          {this.renderControl(cameraControl, () =>
            this.toggleAppService(
              appServicesEnum.PRODUCER,
              framesProducerActive
            )
          )}
        </View>
      </LinearGradient>
    );
  }

  renderVideo() {
    const {
      servicesStatus: {
        framesStreamerReady,
        framesStreamerActive,
        framesProducerActive,
        framesProducerConnectionError,
      },
      uri,
      thumbUri,
      headers,
    } = this.props.videoSource;
    if (
      !framesProducerActive ||
      framesProducerConnectionError ||
      !framesStreamerActive ||
      !framesStreamerReady
    ) {
      return this.renderStatus();
    }
    return (
      <View>
        <VideoPlayer
          ref={(ref) => {
            this.player = ref;
          }}
          uri={uri}
          thumbUri={thumbUri}
          headers={headers}
          controls={false}
          muted={true}
          disableFocus={true}
          startPlaying={false}
          style={{ aspectRatio: videoAspectRatio }}
          disableSeekbar={true}
          disableTimer={true}
          disposeOnPause={true}
          alwaysShowBottomControls={true}
          tapAnywhereToPause={false}
          doubleTapTime={400}
        />
      </View>
    );
  }

  renderStatus() {
    const {
      framesStreamerReady,
      framesStreamerActive,
      framesProducerActive,
      framesProducerConnectionError,
    } = this.props.videoSource.servicesStatus;
    if (framesStreamerActive && !framesStreamerReady) {
      return (
        <View style={styles.status.container}>
          <Text style={styles.status.text}>Starting streaming service...</Text>
          <LoadingActivityIndicator />
        </View>
      );
    }
    let statusMessage;
    if (
      !framesStreamerActive &&
      framesProducerActive &&
      !framesProducerConnectionError
    ) {
      statusMessage = 'Camera streaming service not active';
    }
    if (framesProducerConnectionError) {
      statusMessage = 'An error occurred while trying to connect to camera';
    }
    if (!framesProducerActive) {
      statusMessage = 'Camera service not active';
    }
    return statusMessage ? (
      <View style={styles.status.container}>
        <Text style={styles.status.text}>{statusMessage}</Text>
      </View>
    ) : null;
  }

  render() {
    return (
      <View style={styles.player.container}>
        {this.renderVideo()}
        {this.renderBottomControls()}
      </View>
    );
  }
}

VideoStreamingPlayer.propTypes = {
  videoSource: PropTypes.object.isRequired,
};

const styles = {
  status: StyleSheet.create({
    container: {
      alignItems: 'center',
      aspectRatio: videoAspectRatio,
      backgroundColor: GlobalStyles.blackTextColor,
      justifyContent: 'center',
      width: '100%',
      zIndex: 1,
    },
    text: {
      color: GlobalStyles.whiteTextColor,
      fontSize: wp(3),
    },
  }),
  player: StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 10,
      width: wp(98),
    },
    control: {
      marginRight: iconSize * 0.6,
    },
    controls: {
      alignItems: 'center',
      flexDirection: 'row',
      height: playerControlsHeight,
      justifyContent: 'flex-end',
    },
    controlsGroup: {
      alignItems: 'center',
      flex: 0.33,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    info: {
      flex: 0.33,
    },
    infoText: {
      color: GlobalStyles.whiteTextColor,
      fontSize: GlobalStyles.defaultFontSize,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  }),
};
