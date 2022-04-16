import {Animated, Pressable, StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {ScaleAnimation} from '../../animations';
import PropTypes from 'prop-types';
import Entity from './Entity';
import {StatusLabel} from './controls/StatusLabel';

const itemMargin = 1;
const itemPadding = 3;

export default class SelectableItem extends Component {
  scaleAnimation = new ScaleAnimation();

  onEntityLongPress = () => {
    const {selectionMode, onEntityPress, onEntityLongPress} = this.props;
    if (selectionMode) {
      return;
    }
    onEntityLongPress();
    onEntityPress();
  };

  render() {
    const {selectionMode, ItemComponent, width, entity, entityData, onRefresh, onEntityPress} =
      this.props;
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
          {width: width - 2 * itemMargin},
          styles.container,
          entity.selected ? styles.selected : null,
        ]}
      >
        {selectionMode && entity.isSelected() ? (
          <View style={styles.selectionIndicator}/>
        ) : null}
        <StatusLabel style={styles.statusLabel} status={entity.getStatus()}/>
        <Animated.View style={[styles.itemContainer, this.scaleAnimation.getStyle()]}>
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
    backgroundColor: GlobalStyles.lightVioletColor,
    opacity: '10%',
    zIndex: 0,
  },
  selectionIndicator: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: GlobalStyles.lightVioletColor,
    opacity: 0.4,
    width: '100%',
    height: '100%'
  },
  statusLabel: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
});
