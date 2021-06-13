import {Animated, Pressable, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {ScaleAnimation} from '../../animations';

const itemMargin = 1;
const itemPadding = 3;

export default class SelectableItem extends Component {
  scaleInAnimated = new Animated.Value(0);
  scaleOutAnimated = new Animated.Value(0);

  onItemLongPress = () => {
    const {selectionMode} = this.props;
    if (selectionMode) {
      return;
    }
    this.props.onItemLongPress();
    this.props.onItemPress();
  };

  render() {
    const {selectionMode, ItemComponent, width, item} = this.props;
    return (
      <Pressable
        onPress={this.props.onItemPress}
        onPressIn={() => {
          ScaleAnimation.pressInAnimation(this.scaleInAnimated);
        }}
        onPressOut={() => {
          ScaleAnimation.pressOutAnimation(this.scaleInAnimated);
        }}
        onLongPress={this.onItemLongPress}
        style={[{width: width - 2 * itemMargin}, styles.container, item.selected ? styles.selected : null]}>
        {selectionMode ? (
          <CheckBox
            style={styles.selectionCheckBox}
            disabled={false}
            value={item.selected}
            onValueChange={this.props.onItemPress}
            tintColors={{true: GlobalStyles.violetIconColor, false: GlobalStyles.whiteIconColor}}
          />
        ) : null}
        <Animated.View style={[styles.itemContainer, ScaleAnimation.getScaleTransformationStyle(this.scaleInAnimated)]}>
          <ItemComponent item={item} width={width - 2 * (itemMargin + itemPadding)} />
        </Animated.View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: itemMargin,
  },
  itemContainer: {
    padding: itemPadding,
    width: '100%',
  },
  selected: {
    backgroundColor: GlobalStyles.violetColor,
    zIndex: 0,
  },
  selectionCheckBox: {
    alignItems: 'center',
    position: 'absolute',
    top: '10%',
    zIndex: 1,
  },
});
