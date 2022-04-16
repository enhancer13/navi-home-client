import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import AjaxRequest from '../../../helpers/AjaxRequest';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../../globals/GlobalStyles';
import EntityViewContainer from '../../../components/EntityEditor/EntityViewContainer';
import TextInput from '../../../components/DefaultText';
import { ScaleAnimation } from '../../../animations';
import Dialog from 'react-native-dialog';
import { showError } from '../../../components/ApplicationMessaging/Popups';

const alarmActionIconWidth = 20;
const DaysOfWeekEnum = Object.freeze({
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
});
const AlarmActionsDefaults = Object.freeze({
  SAVE_LOG: {
    id: 1,
    getIcon: (iconColor) => (
      <FontAwesome
        name="pencil-square-o"
        color={iconColor}
        size={alarmActionIconWidth}
      />
    ),
  },
  SAVE_IMAGE: {
    id: 2,
    getIcon: (iconColor) => (
      <Entypo name="images" color={iconColor} size={alarmActionIconWidth} />
    ),
  },
  SEND_EMAIL: {
    id: 3,
    getIcon: (iconColor) => (
      <Fontisto name="email" color={iconColor} size={alarmActionIconWidth} />
    ),
  },
  RECORD_VIDEO: {
    id: 4,
    getIcon: (iconColor) => (
      <Ionicons
        name="recording"
        color={iconColor}
        size={alarmActionIconWidth}
      />
    ),
  },
  NOTIFICATION: {
    id: 5,
    getIcon: (iconColor) => (
      <Ionicons
        name="notifications"
        color={iconColor}
        size={alarmActionIconWidth}
      />
    ),
  },
});
const _ = require('lodash');

function AlarmSuspendDialog(props) {
  const { visible, onCloseRequest, onPress } = props;
  return (
    <Dialog.Container visible={visible} onBackdropPress={onCloseRequest}>
      <Dialog.Title>
        <Text>{'Please choose suspend time:'}</Text>
      </Dialog.Title>
      <Dialog.Button
        style={{ color: GlobalStyles.violetTextColor }}
        label="Remove"
        onPress={() => onPress(0)}
      />
      <Dialog.Button
        style={{ color: GlobalStyles.violetTextColor }}
        label="10 min"
        onPress={() => onPress(10)}
      />
      <Dialog.Button
        style={{ color: GlobalStyles.violetTextColor }}
        label="30 min"
        onPress={() => onPress(30)}
      />
      <Dialog.Button
        style={{ color: GlobalStyles.violetTextColor }}
        label="60 min"
        onPress={() => onPress(60)}
      />
      <Dialog.Button
        style={{ color: GlobalStyles.violetTextColor }}
        label="120 min"
        onPress={() => onPress(120)}
      />
    </Dialog.Container>
  );
}

export default class AlarmProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { dialogVisible: false };
    this.scaleAnimation = new ScaleAnimation();
  }

  renderAlarmDays = (activeDaysOfWeek) => {
    return (
      <View style={styles.itemsContainer}>
        {Object.keys(DaysOfWeekEnum).map((key) => {
          const dayIsActive = activeDaysOfWeek.some(
            (obj) => obj.alarmDayOfWeek === key
          );
          const backgroundColor = dayIsActive
            ? 'rgba(105,89,213,0.30)'
            : 'transparent';
          const alarmDayOfWeek = _.startCase(key.substr(0, 3).toLowerCase());
          return (
            <View
              key={DaysOfWeekEnum[key]}
              style={[
                styles.alarmDayOfWeekContainer,
                {
                  backgroundColor: backgroundColor,
                },
              ]}
            >
              <TextInput style={styles.alarmDayOfWeekText}>
                {alarmDayOfWeek}
              </TextInput>
            </View>
          );
        })}
      </View>
    );
  };

  renderAlarmActions = (activeActions) => {
    return (
      <View style={styles.itemsContainer}>
        {Object.keys(AlarmActionsDefaults).map((key) => {
          const actionIsActive = activeActions.some(
            (obj) => obj.alarmAction === key
          );
          const iconColor = actionIsActive ? '#6959d5' : 'grey';
          return (
            <View
              key={AlarmActionsDefaults[key].id}
              style={styles.alarmActionContainer}
            >
              {AlarmActionsDefaults[key].getIcon(iconColor)}
            </View>
          );
        })}
      </View>
    );
  };

  alarmProfileToggle = async () => {
    const {
      entityData: { controllerUrl },
      item: { id, active },
    } = this.props;
    const requestItem = [
      {
        id,
        active: !active,
      },
    ];
    try {
      await AjaxRequest.put(controllerUrl, JSON.stringify(requestItem), {
        skipResponse: true,
      });
    } catch (ex) {
      showError(`Unable to activate/deactivate alarm profile. ${ex.message}`);
    }
  };

  showSuspendDialog = () => {
    this.setState({ dialogVisible: true });
  };

  closeSuspendDialog = () => {
    this.setState({ dialogVisible: false });
  };

  suspendAlarmProfile = async (minutes) => {
    const {
      entityData: { controllerUrl },
      item: { id },
    } = this.props;
    const requestItem = [
      {
        id,
        suspendSecondsLeft: minutes * 60,
      },
    ];
    try {
      await AjaxRequest.put(controllerUrl, JSON.stringify(requestItem), {
        skipResponse: true,
      });
      this.closeSuspendDialog();
    } catch (ex) {
      showError(`Unable to set/unset suspend time. ${ex.message}`);
    }
  };

  renderMainContent = () => {
    const {
      item: { startTime, endTime, alarmDaysOfWeek, alarmActions, users },
    } = this.props;
    const alarmTimeRange =
      startTime && endTime ? `${startTime} - ${endTime}` : '';
    return (
      <View>
        <View style={styles.alarmActionsContainer}>
          <View style={styles.usersContainer}>
            <TextInput numberOfLines={1} style={styles.usersText}>
              {users.map((user) => user.username).join(', ')}
            </TextInput>
          </View>
          {this.renderAlarmActions(alarmActions)}
        </View>
        <TextInput>{alarmTimeRange}</TextInput>
        {this.renderAlarmDays(alarmDaysOfWeek)}
      </View>
    );
  };

  renderLeftContent = () => {
    const {
      width,
      item: { active, suspendSecondsLeft },
    } = this.props;
    const iconWidth = width * 0.15;
    return (
      <View style={styles.columnContainer}>
        <TouchableOpacity onPress={this.alarmProfileToggle}>
          <Ionicons
            name="power"
            type="ionicon"
            color={active ? '#6959d5' : 'grey'}
            size={iconWidth}
          />
        </TouchableOpacity>
        <Animated.View style={this.scaleAnimation.getStyle(0, 1)}>
          <TouchableOpacity onPress={this.showSuspendDialog}>
            <Ionicons
              name="ios-timer"
              type="ionicon"
              color={suspendSecondsLeft > 0 ? '#6959d5' : 'grey'}
              size={iconWidth / 1.5}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      item: { active },
    } = this.props;
    if (!prevProps.item.active && active) {
      this.scaleAnimation.startScaleInAnimation(500);
    } else if (prevProps.item.active && !active) {
      this.scaleAnimation.startScaleOutAnimation(500);
    }
  }

  componentDidMount() {
    const {
      item: { active },
    } = this.props;
    if (active) {
      this.scaleAnimation.startScaleInAnimation(500);
    } else {
      this.scaleAnimation.startScaleOutAnimation(500);
    }
  }

  render() {
    const {
      width,
      item: { profileName },
    } = this.props;
    const { dialogVisible } = this.state;
    return (
      <View>
        <EntityViewContainer
          title={profileName}
          width={width}
          leftContent={this.renderLeftContent()}
          mainContent={this.renderMainContent()}
        />
        <AlarmSuspendDialog
          visible={dialogVisible}
          onCloseRequest={this.closeSuspendDialog}
          onPress={this.suspendAlarmProfile}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alarmActionContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  alarmActionsContainer: {
    borderBottomWidth: 0.3,
    borderColor: GlobalStyles.lightGreyColor,
    borderTopWidth: 0.3,
    marginBottom: 3,
    paddingBottom: 3,
    width: '100%',
  },
  alarmDayOfWeekContainer: {
    alignItems: 'center',
    borderRadius: 15,
    height: 25,
    justifyContent: 'center',
    marginRight: 3,
    width: 25,
  },
  alarmDayOfWeekText: {
    fontSize: 10,
  },
  columnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  usersContainer: {
    opacity: 0.4,
  },
  usersText: {
    color: GlobalStyles.blackTextColor,
    fontSize: 12,
  },
});
