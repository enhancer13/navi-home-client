import React, {Component} from 'react';
import {FlatList, View, StyleSheet, RefreshControl} from 'react-native';
import AuthService from '../../../helpers/AuthService';
import AjaxRequest from '../../../helpers/AjaxRequest';
import VideoStreamingPlayer from './VideoStreamingPlayer';
import messaging from '@react-native-firebase/messaging';
import Globals from '../../../globals/Globals';
import {LoadingActivityIndicator} from '../../../components';

export default class LiveStreaming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSourceWrappers: {},
      loading: true,
      players: [],
    };
  }

  updateVideoPlayers = (videoSourceWrappers) => {
    let players = [];
    videoSourceWrappers.forEach((videoSourceWrapper) => {
      let videoSourceId = videoSourceWrapper.videoSource.id;
      players.push({
        id: videoSourceId,
        name: videoSourceWrapper.videoSource.cameraName,
        servicesStatus: videoSourceWrapper.servicesStatus,
        thumbSrc: AuthService.buildFetchUrl(Globals.Endpoints.Streaming.THUMBNAIL(videoSourceId)),
        src: {
          uri: AuthService.buildFetchUrl(Globals.Endpoints.Streaming.HLS_PLAYLIST(videoSourceId)),
          headers: AuthService.getAuthorizationHeader(),
        },
      });
    });

    this.setState({
      players: players,
    });
  };

  initFirebaseListener() {
    this.firebaseMessageListener = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data.videoSourceWrappers) {
        const videoSourceWrappers = JSON.parse(remoteMessage.data.videoSourceWrappers);
        this.updateVideoPlayers(videoSourceWrappers);
      }
    });
  }

  fetchVideoPlayers = () => {
    AjaxRequest.get(Globals.Endpoints.Services.APPLICATION_SERVICES_STATUS)
      .then(this.updateVideoPlayers)
      .then(() => {
        this.setState({
          loading: false,
        });
        this.initFirebaseListener();
      })
      .catch((ex) => console.log(ex));
  };

  componentDidMount() {
    this.fetchVideoPlayers();
  }

  componentWillUnmount() {
    this.firebaseMessageListener && this.firebaseMessageListener();
  }

  render() {
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <LoadingActivityIndicator />
        ) : (
          <FlatList
            data={this.state.players}
            renderItem={({item}) => <VideoStreamingPlayer player={item} />}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={this.fetchVideoPlayers} />}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
