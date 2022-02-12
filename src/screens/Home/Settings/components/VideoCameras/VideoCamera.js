import React, { Component } from 'react';
import EntityViewContainer from '../../../../../components/EntityEditor/EntityViewContainer';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../../../../globals/GlobalStyles';
import { LabeledBoolean } from '../../../../../components';

const iconWidth = 20;

export default class VideoCamera extends Component {
  renderCameraDetails = () => {
    const {
      item: {
        frameHeight,
        frameWidth,
        cameraAutoStart,
        videoRecordingAllowed,
        motionDetectionAllowed,
        videoStreamingAllowed,
        objectDetectionAllowed,
        framesFrequency,
      },
    } = this.props;
    return (
      <View>
        <Text numberOfLines={1} style={styles.text}>
          Height: {frameHeight} Width: {frameWidth}
        </Text>
        <Text numberOfLines={1} style={styles.text}>
          Input Frames Frequency: {framesFrequency}
        </Text>
        <View style={styles.row}>
          <View>
            <LabeledBoolean
              value={cameraAutoStart}
              labelText="Autostart:"
              iconWidth={iconWidth}
              labelStyle={styles.text}
            />
            <LabeledBoolean
              value={videoStreamingAllowed}
              labelText="Streaming:"
              iconWidth={iconWidth}
              labelStyle={styles.text}
            />
            <LabeledBoolean
              value={videoRecordingAllowed}
              labelText="Recording:"
              iconWidth={iconWidth}
              labelStyle={styles.text}
            />
          </View>
          <View>
            <LabeledBoolean
              value={motionDetectionAllowed}
              labelText="Motion Detection:"
              iconWidth={iconWidth}
              labelStyle={styles.text}
            />
            <LabeledBoolean
              value={objectDetectionAllowed}
              labelText="Object Detection:"
              iconWidth={iconWidth}
              labelStyle={styles.text}
            />
          </View>
        </View>
      </View>
    );
  };

  mainContentRender = () => {
    return (
      <View>
        <View style={styles.cameraDetailsContainer}>
          {this.renderCameraDetails()}
        </View>
      </View>
    );
  };

  render() {
    const {
      width,
      item: { cameraName },
    } = this.props;
    return (
      <EntityViewContainer
        title={cameraName}
        width={width}
        mainContent={this.mainContentRender()}
      />
    );
  }
}

const styles = StyleSheet.create({
  cameraDetailsContainer: {
    borderBottomWidth: 0.3,
    borderColor: GlobalStyles.lightGreyColor,
    borderTopWidth: 0.3,
    marginBottom: 3,
    paddingBottom: 3,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  text: {
    color: GlobalStyles.blackTextColor,
    fontSize: 12,
  },
});
