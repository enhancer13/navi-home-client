import React, {Component} from 'react';
import {FlatList, View, StyleSheet, RefreshControl} from 'react-native';
import AuthService from '../../../helpers/AuthService';
import AjaxRequest from '../../../helpers/AjaxRequest';
import VideoStreamingPlayer from './VideoStreamingPlayer';
import messaging from '@react-native-firebase/messaging';
import Globals from '../../../globals/Globals';
import {LoadingActivityIndicator} from '../../../components';

export default class LiveStreaming extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     serviceStatusContainers: {},
  //     loading: false,
  //     players: [],
  //   };
  // }
  //
  // initConnection = () => {
  //   const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  //   const pc = new RTCPeerConnection(configuration);
  //   let isFront = true;
  //   mediaDevices.enumerateDevices().then((sourceInfos) => {
  //     console.log(sourceInfos);
  //     let videoSourceId;
  //     for (let i = 0; i < sourceInfos.length; i++) {
  //       const sourceInfo = sourceInfos[i];
  //       if (sourceInfo.kind === 'videoinput' && sourceInfo.facing === (isFront ? 'front' : 'environment')) {
  //         videoSourceId = sourceInfo.deviceId;
  //       }
  //     }
  //     mediaDevices
  //       .getUserMedia({
  //         audio: true,
  //         video: {
  //           width: 640,
  //           height: 480,
  //           frameRate: 30,
  //           facingMode: isFront ? 'user' : 'environment',
  //           deviceId: videoSourceId,
  //         },
  //       })
  //       .then((stream) => {
  //         console.log('got stream!!!!');
  //         // Got stream!
  //       })
  //       .catch((error) => {
  //         // Log error
  //       });
  //   });
  // };
  //
  // //when somebody sends us an offer
  // handleOffer = async (offer, name) => {
  //   console.log(name + ' is calling you.');
  //
  //   console.log('Accepting Call===========>', offer);
  //   //connectedUser = name;
  //
  //   try {
  //     //await yourConn.setRemoteDescription(new RTCSessionDescription(offer));
  //     //const answer = await yourConn.createAnswer();
  //     //await yourConn.setLocalDescription(answer);
  //     // send({
  //     //   type: 'answer',
  //     //   answer: answer,
  //     // });
  //   } catch (err) {
  //     console.log('Offerr Error', err);
  //   }
  // };
  //
  // //when we got an answer from a remote user
  // handleAnswer = (answer) => {
  //   //yourConn.setRemoteDescription(new RTCSessionDescription(answer));
  // };
  //
  // //when we got an ice candidate from a remote user
  // handleCandidate = (candidate) => {
  //   //setCalling(false);
  //   console.log('Candidate ----------------->', candidate);
  //   //yourConn.addIceCandidate(new RTCIceCandidate(candidate));
  // };
  //
  // onopen = () => {
  //   console.log('Connected to the signaling server');
  // };
  //
  // //when we got a message from a signaling server
  // onmessage = (msg) => {
  //   let data;
  //   if (msg.data === 'Hello world') {
  //     data = {};
  //   } else {
  //     data = JSON.parse(msg.data);
  //     console.log('Data --------------------->', data);
  //     switch (data.type) {
  //       case 'login':
  //         console.log('Login');
  //         break;
  //       //when somebody wants to call us
  //       case 'offer':
  //         this.handleOffer(data.offer, data.name);
  //         console.log('Offer');
  //         break;
  //       case 'answer':
  //         this.handleAnswer(data.answer);
  //         console.log('Answer');
  //         break;
  //       //when a remote peer sends an ice candidate to us
  //       case 'candidate':
  //         this.handleCandidate(data.candidate);
  //         console.log('Candidate');
  //         break;
  //       case 'leave':
  //         this.handleLeave();
  //         console.log('Leave');
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };
  //
  // onerror = function (err) {
  //   console.log('Got error', err);
  // };
  //
  // render() {
  //   const {loading} = this.state;
  //   return (
  //     <View style={styles.container}>
  //       {loading ? (
  //         <LoadingActivityIndicator />
  //       ) : (
  //         <WS
  //           ref={(ref) => {
  //             this.ws = ref;
  //           }}
  //           url="ws://192.168.0.104:5119/webrtc_playnow/singleport/tcp/kitchen-camera"
  //           onOpen={this.onopen}
  //           onMessage={this.onmessage}
  //           onError={this.onerror}
  //           onClose={console.log}
  //           reconnect // Will try to reconnect onClose
  //         />
  //       )}
  //     </View>
  //   );
  // }

  constructor(props) {
    super(props);
    this.state = {
      serviceStatusContainers: {},
      loading: true,
      players: [],
    };
  }

  updateVideoPlayers = (serviceStatusContainers) => {
    let players = [];
    serviceStatusContainers.forEach((serviceStatusContainer) => {
      let videoSourceId = serviceStatusContainer.videoSource.id;
      players.push({
        id: videoSourceId,
        name: serviceStatusContainer.videoSource.cameraName,
        servicesStatus: serviceStatusContainer.servicesStatus,
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
      if (remoteMessage.data.applicationStatus) {
        const applicationStatus = JSON.parse(remoteMessage.data.applicationStatus);
        const serviceStatusContainers = applicationStatus.serviceStatusContainers;
        this.updateVideoPlayers(serviceStatusContainers);
      }
    });
  }

  fetchVideoPlayers = () => {
    AjaxRequest.get(Globals.Endpoints.Services.APPLICATION_SERVICES_STATUS)
      .then((status) => status.serviceStatusContainers)
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
