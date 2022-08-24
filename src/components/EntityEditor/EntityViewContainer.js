import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { GlobalStyles } from '../../config/GlobalStyles';
import PropTypes from 'prop-types';

export default class EntityViewContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, title, leftContent, mainContent } = this.props;
    return (
      <View style={[styles.container, { width: width }]}>
        <ListItem containerStyle={[styles.listItemContainer, { width: width }]}>
          {leftContent}
          {leftContent ? <View style={styles.verticalDivider} /> : null}
          <ListItem.Content style={styles.listItemContent}>
            <ListItem.Title numberOfLines={1} style={styles.listItemTitle}>
              {title}
            </ListItem.Title>
            <ListItem.Subtitle />
            <View style={styles.contentContainer}>{mainContent}</View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }
}

EntityViewContainer.propTypes = {
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  leftContent: PropTypes.object,
  mainContent: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  contentContainer: {
    width: '100%',
  },
  listItemContainer: {
    backgroundColor: GlobalStyles.whiteBackgroundColor,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: GlobalStyles.lightGreyColor,
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
    color: GlobalStyles.blackTextColor,
  },
  verticalDivider: {
    backgroundColor: GlobalStyles.lightGreyColor,
    height: '90%',
    width: 1,
  },
});
