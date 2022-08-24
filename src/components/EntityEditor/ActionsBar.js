import React, { Component } from 'react';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GlobalStyles } from '../../config/GlobalStyles';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import {SlideAnimation} from '../../animations';

export default class ActionsBar extends Component {
  constructor(props) {
    super(props);
    this.slideAnimation = new SlideAnimation(new Animated.Value(props.containerStyle.height));
  }

  loadingAnimation = () =>{
    Animated.sequence([
      Animated.delay(200),
      this.slideAnimation.getAnimation(0, 200)
    ]).start();
  }

  closingAnimation = () => {
    const bottomInsets = Platform.OS === 'ios' ? this.props.insets.bottom : 0;
    this.slideAnimation.getAnimation(this.props.containerStyle.height + bottomInsets, 200).start(this.props.onClose)
  }

  componentDidMount() {
    this.loadingAnimation();
  }

  render() {
    const {
      onSave,
      onCopy,
      onDelete,
      onSelectAll,
      onDeselectAll,
      onRevert,
      allowedActions,
      containerStyle,
      iconStyle,
    } = this.props;
    const iconSize = containerStyle.height * 0.8;
    const iconColor = iconStyle?.iconColor ?? GlobalStyles.lightIconColor;
    return (
      <Animated.View
        style={[
          styles.actionsBar,
          containerStyle,
          {
            //opacity: this.actionsBarAnimationValue,
          },
          this.slideAnimation.getStyle(),
        ]}
      >
        <View style={styles.dynamicItemsContainer}>
          {(allowedActions.create || allowedActions.update) && (
            <View style={styles.rowContainer}>
              <TouchableScale onPress={onSave} style={styles.iconContainer}>
                <Entypo name="save" color={iconColor} size={iconSize} />
              </TouchableScale>
              <TouchableScale onPress={onCopy} style={styles.iconContainer}>
                <FontAwesome name="copy" color={iconColor} size={iconSize} />
              </TouchableScale>
            </View>
          )}
          {allowedActions.delete && (
            <TouchableScale onPress={onDelete} style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="delete"
                color={iconColor}
                size={iconSize}
              />
            </TouchableScale>
          )}
          {allowedActions.select && (
            <View style={styles.rowContainer}>
              <TouchableScale
                onPress={onSelectAll}
                style={styles.iconContainer}
              >
                <MaterialIcons
                  name="check-box"
                  color={iconColor}
                  size={iconSize}
                />
              </TouchableScale>
              <TouchableScale
                onPress={onDeselectAll}
                style={styles.iconContainer}
              >
                <MaterialIcons
                  name="check-box-outline-blank"
                  color={iconColor}
                  size={iconSize}
                />
              </TouchableScale>
            </View>
          )}
          {allowedActions.update && (
            <View style={styles.rowContainer}>
              <TouchableScale onPress={onRevert} style={styles.iconContainer}>
                <Entypo name="back-in-time" color={iconColor} size={iconSize} />
              </TouchableScale>
            </View>
          )}
        </View>
        <View style={{ ...styles.fixedItemsContainer, width: iconSize * 1.05 }}>
          <TouchableScale onPress={this.closingAnimation}>
            <AntDesign name="closesquareo" color={iconColor} size={iconSize} />
          </TouchableScale>
        </View>
      </Animated.View>
    );
  }
}

ActionsBar.propTypes = {
  onSave: PropTypes.func,
  onCopy: PropTypes.func,
  onDelete: PropTypes.func,
  onSelectAll: PropTypes.func,
  onDeselectAll: PropTypes.func,
  onRevert: PropTypes.func,
  allowedActions: PropTypes.object.isRequired,
  containerStyle: ViewPropTypes.style,
  insets: PropTypes.object,
  iconStyle: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  actionsBar: {
    alignSelf: 'center',
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
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
