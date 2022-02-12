import { Animated, Pressable, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { GlobalStyles } from '../../globals/GlobalStyles';
import { ScaleAnimation } from '../../animations';
import PropTypes from 'prop-types';
import Entity from './Entity';
import { StatusLabel } from './controls/StatusLabel';

const itemMargin = 1;
const itemPadding = 3;

export default class SelectableItem extends Component {
  scaleAnimation = new ScaleAnimation();

  onEntityLongPress = () => {
    const { selectionMode, onEntityPress, onEntityLongPress } = this.props;
    if (selectionMode) {
      return;
    }
    onEntityLongPress();
    onEntityPress();
  };

  render() {
    const {
      selectionMode,
      ItemComponent,
      width,
      entity,
      entityData,
      onRefresh,
      onEntityPress,
    } = this.props;
    return (
      <Pressable
        onPress={onEntityPress}
        onPressIn={() => {
          this.scaleAnimation.startScaleInAnimation();
        }}
        onPressOut={() => {
          this.scaleAnimation.startScaleOutAnimation();
        }}
        onLongPress={this.onEntityLongPress}
        style={[
          { width: width - 2 * itemMargin },
          styles.container,
          entity.selected ? styles.selected : null,
        ]}
      >
        {selectionMode ? (
          <CheckBox
            style={styles.selectionCheckBox}
            disabled={false}
            value={entity.isSelected()}
            onValueChange={onEntityPress}
            tintColors={{
              true: GlobalStyles.violetIconColor,
              false: GlobalStyles.transparentIconColor,
            }}
          />
        ) : null}
        <StatusLabel style={styles.statusLabel} status={entity.getStatus()} />
        <Animated.View
          style={[styles.itemContainer, this.scaleAnimation.getStyle()]}
        >
          <ItemComponent
            item={entity.getItem()}
            width={width - 2 * (itemMargin + itemPadding)}
            entityData={entityData}
            onRefresh={onRefresh}
          />
        </Animated.View>
      </Pressable>
    );
  }
}

SelectableItem.propTypes = {
  ItemComponent: PropTypes.elementType.isRequired,
  selectionMode: PropTypes.bool.isRequired,
  entityData: PropTypes.object.isRequired,
  onEntityPress: PropTypes.func.isRequired,
  onEntityLongPress: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  entity: PropTypes.instanceOf(Entity).isRequired,
};

const styles = StyleSheet.create({
  container: {
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
    left: '5%',
    position: 'absolute',
    top: '5%',
    zIndex: 1,
  },
  statusLabel: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
});
