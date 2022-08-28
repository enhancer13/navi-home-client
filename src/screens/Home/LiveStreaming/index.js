import React, {Component} from 'react';
import {FlatList, View, StyleSheet, RefreshControl} from 'react-native';
import AuthService from '../../../helpers/AuthService';
import AjaxRequest from '../../../helpers/AjaxRequest';
import VideoStreamingPlayer from './VideoStreamingPlayer';
import {LoadingActivityIndicator} from '../../../components';
import {EventRegister} from 'react-native-event-listeners';
import FlexContainer from '../../../components/View/FlexContainer';
import {backendEndpoints} from '../../../config/BackendEndpoints';
import FlexSafeAreaView from '../../../components/View/FlexSafeAreaView';

export default class LiveStreaming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceStatusContainers: {},
      loading: true,
      players: [],
    };
  }

  updateVideoPlayers = (serviceStatusContainers) => {
    const videoSources = [];
    serviceStatusContainers.forEach((serviceStatusContainer) => {
      const videoSourceId = serviceStatusContainer.videoSource.id;
      videoSources.push({
        id: videoSourceId,
        name: serviceStatusContainer.videoSource.cameraName,
        servicesStatus: serviceStatusContainer.servicesStatus,
        thumbUri: AuthService.buildFetchUrl(
          backendEndpoints.Streaming.THUMBNAIL(videoSourceId),
        ),
        uri: AuthService.buildFetchUrl(
          backendEndpoints.Streaming.HLS_PLAYLIST(videoSourceId),
        ),
        headers: AuthService.getAuthorizationHeader(),
      });
    });

    this.setState({
      videoSources,
    });
  };

  initEventListener() {
    this.firebaseMessageListener = EventRegister.addEventListener(
      'applicationStatus',
      ({serviceStatusContainers}) =>
        this.updateVideoPlayers(serviceStatusContainers),
    );
  }

  fetchVideoPlayers = () => {
    AjaxRequest.get(backendEndpoints.Services.APPLICATION_SERVICES_STATUS)
      .then((status) => status.serviceStatusContainers)
      .then(this.updateVideoPlayers)
      .then(() => {
        this.setState({
          loading: false,
        });
        this.initEventListener();
      })
      .catch((ex) => console.log(ex));
  };

  componentDidMount() {
    this.fetchVideoPlayers();
  }

  componentWillUnmount() {
    this.firebaseMessageListener &&
    EventRegister.removeEventListener(this.firebaseMessageListener);
  }

  render() {
    const {loading, videoSources} = this.state;
    return (
      <FlexContainer style={styles.container} bottomTransparency>
        {loading ? (
          <LoadingActivityIndicator/>
        ) : (
          <FlatList
            data={videoSources}
            renderItem={({item}) => (
              <VideoStreamingPlayer videoSource={item}/>
            )}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this.fetchVideoPlayers}
              />
            }
          />
        )}
      </FlexContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
