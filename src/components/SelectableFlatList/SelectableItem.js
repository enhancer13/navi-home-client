import {Animated, Pressable, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {ScaleAnimation} from '../../animations';

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
    const {selectionMode, item, itemComponent} = this.props;
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
        style={item.selected ? styles.containerSelected : styles.container}>
        {selectionMode ? (
          <CheckBox
            style={styles.selectionCheckBox}
            disabled={false}
            value={item.selected}
            onValueChange={this.props.onItemPress}
            tintColors={{true: GlobalStyles.violetColor, false: 'white'}}
          />
        ) : null}
        <Animated.View style={ScaleAnimation.getScaleTransformationStyle(this.scaleInAnimated)}>{itemComponent}</Animated.View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  containerSelected: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    justifyContent: 'center',
    margin: 2,
    zIndex: 0,
  },
  selectionCheckBox: {
    left: '10%',
    position: 'absolute',
    top: '10%',
    zIndex: 1,
  },
});
