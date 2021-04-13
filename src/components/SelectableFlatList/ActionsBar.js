import React, {Component} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const barHeight = Dimensions.get('window').height * 0.05;
const iconSize = barHeight * 0.8;
const iconColor = '#6959d5';

export default class ActionsBar extends Component {
  constructor(props) {
    super(props);
    this.actionsBarAnimationValue = new Animated.Value(0);
  }

  loadingAnimation = () => {
    this.actionsBarAnimationValue.setValue(0);
    Animated.timing(this.actionsBarAnimationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  closingAnimation = () => {
    Animated.timing(this.actionsBarAnimationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(this.props.onClose);
  };

  componentDidMount() {
    this.loadingAnimation();
  }

  render() {
    return (
      <Animated.View
        style={[this.props.style, styles.actionsBar, {opacity: this.actionsBarAnimationValue, transform: [{scale: this.actionsBarAnimationValue}]}]}>
        <View style={styles.dynamicItemsContainer}>
          <TouchableScale onPress={this.props.onSave}>
            <Entypo name="save" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale onPress={this.props.onDelete}>
            <MaterialCommunityIcons name="delete" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
        <View style={styles.fixedItemsContainer}>
          <TouchableScale onPress={this.closingAnimation}>
            <AntDesign name="closesquareo" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  actionsBar: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(218,209,252,0.9)',
    borderRadius: 5,
    height: barHeight,
    width: Dimensions.get('window').width * 0.9,
  },
  dynamicItemsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  fixedItemsContainer: {
    justifyContent: 'center',
    marginRight: 5,
    width: iconSize * 1.05,
  },
});
