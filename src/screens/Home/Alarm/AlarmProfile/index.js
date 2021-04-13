import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import AjaxRequest from '../../../../helpers/AjaxRequest';
import Globals from '../../../../globals/Globals';
import TouchableScale from 'react-native-touchable-scale';
import {ListItem} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../../../globals/GlobalStyles';

const {width} = Dimensions.get('window');
const containerWidth = width * 0.85;
const alarmToggleIconWidth = containerWidth * 0.15;
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
    getIcon: (iconColor) => <FontAwesome name="pencil-square-o" color={iconColor} size={alarmActionIconWidth} />,
  },
  SAVE_IMAGE: {
    id: 2,
    getIcon: (iconColor) => <Entypo name="images" color={iconColor} size={alarmActionIconWidth} />,
  },
  SEND_EMAIL: {
    id: 3,
    getIcon: (iconColor) => <Fontisto name="email" color={iconColor} size={alarmActionIconWidth} />,
  },
  RECORD_VIDEO: {
    id: 4,
    getIcon: (iconColor) => <Ionicons name="recording" color={iconColor} size={alarmActionIconWidth} />,
  },
  NOTIFICATION: {
    id: 5,
    getIcon: (iconColor) => <Ionicons name="notifications" color={iconColor} size={alarmActionIconWidth} />,
  },
});
const _ = require('lodash');

export default class AlarmProfile extends Component {
  constructor(props) {
    super(props);
  }

  renderAlarmDays = (activeDaysOfWeek) => {
    return (
      <View style={styles.itemsContainer}>
        {Object.keys(DaysOfWeekEnum).map((key) => {
          const dayIsActive = activeDaysOfWeek.some((obj) => obj.alarmDayOfWeek === key);
          const backgroundColor = dayIsActive ? 'rgba(105,89,213,0.30)' : 'transparent';
          return (
            <View
              key={DaysOfWeekEnum[key]}
              style={[
                styles.alarmDayOfWeekContainer,
                {
                  backgroundColor: backgroundColor,
                },
              ]}>
              <Text style={styles.alarmDayOfWeekText}>{_.startCase(key.substr(0, 3).toLowerCase())}</Text>
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
          const actionIsActive = activeActions.some((obj) => obj.alarmAction === key);
          const iconColor = actionIsActive ? '#6959d5' : 'grey';
          return (
            <View key={AlarmActionsDefaults[key].id} style={styles.alarmActionContainer}>
              {AlarmActionsDefaults[key].getIcon(iconColor)}
            </View>
          );
        })}
      </View>
    );
  };

  alarmProfileToggle = () => {
    AjaxRequest.put(
      Globals.Endpoints.Entities.ALARM_PROFILES,
      JSON.stringify([
        {
          id: this.props.alarmProfile.id,
          active: !this.props.alarmProfile.active,
        },
      ]),
      {skipResponse: true},
    ).then(this.props.fetchData);
  };

  render() {
    const {
      alarmProfile: {active, profileName, startTime, endTime, alarmDaysOfWeek, alarmActions, users},
    } = this.props;
    return (
      <View style={styles.container}>
        <ListItem Component={TouchableScale} friction={90} tension={100} activeScale={0.95} containerStyle={styles.listItemContainer}>
          <TouchableOpacity onPress={this.alarmProfileToggle}>
            <Ionicons name="power" type="ionicon" color={active ? '#6959d5' : 'grey'} size={alarmToggleIconWidth} />
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <ListItem.Content style={styles.listItemContent}>
            <ListItem.Title numberOfLines={1} style={styles.listItemTitle}>
              {profileName}
            </ListItem.Title>
            <ListItem.Subtitle />
            <View style={styles.alarmActionsContainer}>
              <View style={styles.usersContainer}>
                <Text numberOfLines={1} style={styles.usersText}>
                  {users.map((user) => user.username).join(', ')}
                </Text>
              </View>
              {this.renderAlarmActions(alarmActions)}
            </View>
            <Text>
              {startTime} - {endTime}
            </Text>
            {this.renderAlarmDays(alarmDaysOfWeek)}
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alarmActionContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  // eslint-disable-next-line react-native/no-color-literals
  alarmActionsContainer: {
    borderBottomWidth: 0.3,
    borderColor: '#abacc3',
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
  container: {
    alignItems: 'center',
    flex: 1,
  },
  itemsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItemContainer: {
    backgroundColor: GlobalStyles.listItem.backgroundColor,
    borderRadius: 10,
    marginBottom: 7,
    marginTop: 3,
    width: containerWidth,
    ...Platform.select({
      ios: {
        shadowColor: '#abacc3',
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  listItemContent: {
    flexGrow: 1,
  },
  listItemTitle: {
    color: GlobalStyles.listItem.textColor,
  },
  usersContainer: {
    opacity: 0.4,
  },
  usersText: {
    color: GlobalStyles.listItem.textColor,
    fontSize: 12,
  },
  // eslint-disable-next-line react-native/no-color-literals
  verticalDivider: {
    backgroundColor: '#abacc3',
    height: '90%',
    width: 1,
  },
});
