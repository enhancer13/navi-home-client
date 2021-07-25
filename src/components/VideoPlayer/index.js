import React, {Component} from 'react';
import {Video} from 'expo-av';
import {TouchableOpacity, StyleSheet, View, ActivityIndicator, Text, Animated, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ScreenOrientation from 'expo-screen-orientation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {LoadingActivityIndicator} from '../index';

const playerControlsHeight = wp(5);
const iconSize = playerControlsHeight * 0.9;

const videoPlayerInitialStatus = {
  isMuted: true,
  shouldPlay: true,
};

// noinspection JSUnresolvedVariable
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldPlay: false,
      isPlaying: false,
      videoError: false,
      playButtonIcon: 'play',
      playButtonOpacity: new Animated.Value(1),
      playButtonScale: new Animated.Value(1),
    };
  }

  videoError = (error) => {
    console.log('error: ', error);
    this.player.unloadAsync();
    this.setState({
      videoError: true,
      shouldPlay: true,
      isPlaying: false,
    });
  };

  startPlayingAnimation = () => {
    this.state.playButtonOpacity.setValue(1);
    this.state.playButtonScale.setValue(1);
    Animated.sequence([
      Animated.timing(this.state.playButtonScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.playButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.playButtonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await this.setState({playButtonIcon: 'pause'});
      Animated.sequence([
        Animated.timing(this.state.playButtonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(this.state.playButtonOpacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({playButtonIcon: 'play'});
      });
    });
  };

  stopPlayingAnimation = () => {
    this.state.playButtonOpacity.setValue(0);
    Animated.timing(this.state.playButtonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  clickPlayButton = async (showAnimation) => {
    let playbackStatus = await this.player.getStatusAsync();
    if (playbackStatus.isLoaded) {
      await this.player.unloadAsync();
      if (showAnimation) {
        this.stopPlayingAnimation();
      }
      this.setState({
        shouldPlay: false,
        isPlaying: false,
      });
    } else {
      if (showAnimation) {
        this.startPlayingAnimation();
      }
      await this.player.loadAsync(this.props.player.src, videoPlayerInitialStatus, true);
      this.setState({
        shouldPlay: true,
      });
    }
  };

  clickFullscreenButton = async () => {
    await this.player.presentFullscreenPlayer();
  };

  onPlaybackStatusUpdate = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      // Send Expo team the error on Slack or the forums so we can help you debug!
      if (playbackStatus.error) {
        console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
      }
    } else {
      if (this.state.isPlaying !== playbackStatus.isPlaying && !this.playerStateChangeTimer) {
        if (playbackStatus.isPlaying) {
          this.setState({
            isPlaying: true,
          });
        } else {
          this.playerStateChangeTimer = setTimeout(async () => {
            console.log('point 4');
            if (this.player) {
              let status = await this.player.getStatusAsync();
              if (!status.isPlaying) {
                this.setState({
                  isPlaying: false,
                });
              }
            }
            this.playerStateChangeTimer = null;
          }, 2000);
        }
      }
      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  };

  onFullscreenUpdate = async ({fullscreenUpdate}) => {
    switch (fullscreenUpdate) {
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
        console.log('The fullscreen player is about to present.');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
        console.log('The fullscreen player just finished presenting.');
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        console.log('The fullscreen player is about to dismiss.');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
        console.log('The fullscreen player just finished dismissing.');
    }
  };

  componentWillUnmount() {
    if (this.playerStateChangeTimer) {
      clearTimeout(this.playerStateChangeTimer);
      this.playerStateChangeTimer = null;
    }
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    return !nextProps.isPlaying
      ? {
          isPlaying: false,
          shouldPlay: false,
          videoError: false,
          playButtonIcon: 'play',
        }
      : null;
  }*/

  render() {
    const {loading, ready} = this.props;
    let video;
    if (ready) {
      let videoError = null;
      let videoThumb = null;
      let videoBuffering = null;
      let videoControls = null;

      const error = this.state.videoError;
      const buffering = this.state.shouldPlay && !this.state.isPlaying && !error;
      const paused = !this.state.shouldPlay && !error;
      console.log('state: ', this.state);
      if (error) {
        videoError = (
          <View style={styles.onTopOfPlayerBlack}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Network request failed.</Text>
              <TouchableOpacity
                onPress={async () => {
                  this.setState({
                    videoError: false,
                    playButtonOpacity: new Animated.Value(0),
                  });
                  await this.clickPlayButton(false);
                }}>
                <Entypo name="cycle" color="white" size={50} />
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        if (buffering) {
          videoBuffering = (
            <View style={styles.onTopOfPlayer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          );
        }
        if (paused) {
          videoThumb = (
            <Image
              style={styles.onTopOfPlayer}
              source={{
                uri: this.props.player.thumbSrc,
                headers: this.props.player.src.headers,
              }}
            />
          );
        }
        videoControls = (
          <Animated.View
            style={[
              styles.onTopOfPlayer,
              {
                opacity: this.state.playButtonOpacity,
                transform: [{scale: this.state.playButtonScale}],
              },
            ]}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.clickPlayButton(true)}>
              <Ionicons name={this.state.playButtonIcon} color={'white'} size={iconSize * 3} />
            </TouchableOpacity>
          </Animated.View>
        );
      }

      video = (
        <View style={styles.videoPlayerContainer}>
          <Video
            useNativeControls={true}
            /*
            usePoster
*/
            onError={this.videoError}
            resizeMode={Video.RESIZE_MODE_COVER}
            style={styles.videoPlayer}
            ref={(ref) => {
              this.player = ref;
            }}
            progressUpdateIntervalMillis={500}
            onPlaybackStatusUpdate={(playbackStatus) => this.onPlaybackStatusUpdate(playbackStatus)}
            onFullscreenUpdate={this.onFullscreenUpdate}
          />
          {videoError}
          {videoThumb}
          {videoBuffering}
          {videoControls}
        </View>
      );
    } else if (loading) {
      video = (
        <View style={styles.videoPlayerContainer}>
          <LoadingActivityIndicator />
        </View>
      );
    } else {
      video = <View style={styles.videoPlayerContainer} />;
    }
    return <View style={styles.container}>{video}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: wp(98),
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    height: '30%',
    justifyContent: 'center',
    width: '30%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  onTopOfPlayer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // eslint-disable-next-line react-native/no-color-literals
  onTopOfPlayerBlack: {
    alignItems: 'center',
    backgroundColor: 'black',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  videoPlayerContainer: {
    alignItems: 'center',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});
