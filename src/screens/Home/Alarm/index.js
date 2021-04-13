import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Dimensions, RefreshControl} from 'react-native';
import ajaxRequest from '../../../helpers/AjaxRequest';
import Globals from '../../../globals/Globals';
import AlarmProfile from './AlarmProfile';
import {LoadingActivityIndicator} from '../../../components';
import {GlobalStyles} from '../../../globals/GlobalStyles';

export default class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmProfiles: [],
      loading: true,
    };
  }

  fetchAlarmProfiles = () => {
    ajaxRequest.get(Globals.Endpoints.Entities.ALARM_PROFILES).then((response) => {
      this.setState({
        alarmProfiles: response.data,
        loading: false,
      });
    });
  };

  renderAlarmProfile = ({item}) => <AlarmProfile alarmProfile={item} fetchData={this.fetchAlarmProfiles} />;

  componentDidMount() {
    this.fetchAlarmProfiles();
  }

  render() {
    const {loading, alarmProfiles} = this.state;
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.informationBar} />
        {loading ? (
          <LoadingActivityIndicator />
        ) : (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={alarmProfiles}
            renderItem={(item) => this.renderAlarmProfile(item)}
            style={styles.flatListContainer}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={this.fetchAlarmProfiles} />}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  flatListContainer: {
    height: '100%',
    width: '100%',
  },
  // eslint-disable-next-line react-native/no-color-literals
  informationBar: {
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderColor: '#abacc3',
    elevation: 2,
    height: Dimensions.get('window').height * 0.1,
    width: '100%',
  },
});
