import React, {Component} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GlobalStyles} from '../../globals/GlobalStyles';

const iconColor = GlobalStyles.lightIconColor;

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
    const {onSave, onDelete, onSelectAll, onDeselectAll, style} = this.props;
    const iconSize = style.height * 0.8;
    return (
      <Animated.View
        style={[styles.actionsBar, style, {opacity: this.actionsBarAnimationValue, transform: [{scale: this.actionsBarAnimationValue}]}]}>
        <View style={styles.dynamicItemsContainer}>
          <TouchableScale onPress={onSave} style={styles.iconContainer}>
            <Entypo name="save" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale onPress={onDelete} style={styles.iconContainer}>
            <MaterialCommunityIcons name="delete" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale onPress={onSelectAll} style={styles.iconContainer}>
            <MaterialIcons name="check-box" color={iconColor} size={iconSize} />
          </TouchableScale>
          <TouchableScale onPress={onDeselectAll} style={styles.iconContainer}>
            <MaterialIcons name="check-box-outline-blank" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
        <View style={{...styles.fixedItemsContainer, width: iconSize * 1.05}}>
          <TouchableScale onPress={this.closingAnimation}>
            <AntDesign name="closesquareo" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  actionsBar: {
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    flexGrow: 1,
  },
  dynamicItemsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginRight: 5,
  },
  fixedItemsContainer: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
});
