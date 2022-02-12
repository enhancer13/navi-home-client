import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../globals/GlobalStyles';
import DefaultSearchBar from './SearchBar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ActionsBar from './ActionsBar';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: false,
      searchValue: '',
      titleTextOpacity: new Animated.Value(1),
      searchBarScale: new Animated.Value(0),
    };
  }

  searchBarCloseAnimation = () => {
    Animated.timing(this.state.searchBarScale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      this.setState((prevState) => ({
        searchMode: !prevState.searchMode,
      }));
      this.state.titleTextOpacity.setValue(0);
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(this.state.titleTextOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  searchBarOpenAnimation = () => {
    Animated.timing(this.state.titleTextOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState((prevState) => ({
        searchMode: !prevState.searchMode,
      }));
      this.state.searchBarScale.setValue(0);
      Animated.timing(this.state.searchBarScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  onSearch = (searchValue) => {
    this.setState({
      searchValue,
    });
    this.props.onSearch(searchValue);
  };

  render() {
    const {
      title,
      subTitle,
      backButton,
      navigation,
      enableSearch,
      selectionMode,
      onStopSelectionMode,
      onSelectAll,
      onDeselectAll,
      onSave,
      onCopy,
      onDelete,
      onRevert,
      databaseMethods,
    } = this.props;
    const { searchMode, searchBarScale, searchValue } = this.state;
    return (
      <View style={styles.container}>
        {backButton ? (
          <TouchableScale onPress={navigation.goBack}>
            <Ionicon name="arrow-back" color={'white'} size={30} />
          </TouchableScale>
        ) : null}
        <View style={styles.columnContainer}>
          <View style={styles.rowContainer}>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <View style={{ flexGrow: 1 }}>
              {searchMode ? (
                <Animated.View
                  style={{ transform: [{ scaleX: searchBarScale }] }}
                >
                  <DefaultSearchBar
                    onChangeText={this.onSearch}
                    onClear={this.onSearch}
                    searchValue={searchValue}
                  />
                </Animated.View>
              ) : (
                <View>
                  <Animated.Text
                    style={[
                      styles.titleText,
                      { opacity: this.state.titleTextOpacity },
                    ]}
                  >
                    {title}
                  </Animated.Text>
                </View>
              )}
            </View>
            {enableSearch ? (
              <TouchableScale
                onPress={() => {
                  if (searchMode) {
                    this.searchBarCloseAnimation();
                  } else {
                    this.searchBarOpenAnimation();
                  }
                }}
              >
                <Ionicon
                  name={searchMode ? 'close-outline' : 'search-outline'}
                  color={'white'}
                  size={30}
                />
              </TouchableScale>
            ) : null}
          </View>
          <View style={styles.rowContainer}>
            {selectionMode ? (
              <ActionsBar
                onSave={onSave}
                onCopy={onCopy}
                onDelete={onDelete}
                onRevert={onRevert}
                onSelectAll={onSelectAll}
                onDeselectAll={onDeselectAll}
                onClose={onStopSelectionMode}
                style={styles.actionsBar}
                allowedActions={{ ...databaseMethods, select: true }}
              />
            ) : (
              <Text style={styles.subTitleText}>{subTitle}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionsBar: {
    alignSelf: 'flex-start',
    borderTopColor: GlobalStyles.lightBackgroundColor,
    borderTopWidth: 2,
    height: hp(5),
  },
  columnContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 5,
  },
  container: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    elevation: 5,
    flexDirection: 'row',
    height: hp(10),
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    height: hp(5),
  },
  subTitleText: {
    alignSelf: 'flex-start',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
  titleText: {
    alignSelf: 'flex-start',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultTitleFontSize,
  },
});
