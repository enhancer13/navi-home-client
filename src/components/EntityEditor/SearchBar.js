import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import { GlobalStyles } from '../../globals/GlobalStyles';

export default class DefaultSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.initialized) {
      return {
        searchValue: nextProps.searchValue,
        initialized: true,
      };
    }
    return null;
  }

  render() {
    return (
      <SearchBar
        round
        placeholder="Type to search..."
        onChangeText={(text) => {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.setState({ searchValue: text });
          this.timeout = setTimeout(() => this.props.onChangeText(text), 500);
        }}
        onClear={this.props.onClear}
        value={this.state.searchValue}
        containerStyle={[styles.container, this.props.style]}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        placeholderTextColor={'rgba(238,234,255,0.6)'}
        searchIcon={false}
        clearIcon={styles.searchIcon}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.violetBackgroundColor,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    padding: 0,
    width: '100%',
  },
  inputContainerStyle: {
    backgroundColor: GlobalStyles.lightVioletColor,
    height: '100%',
  },
  inputStyle: {
    alignSelf: 'center',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
  searchIcon: {
    color: GlobalStyles.whiteTextColor,
  },
});
