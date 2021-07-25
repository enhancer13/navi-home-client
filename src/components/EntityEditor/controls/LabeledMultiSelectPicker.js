import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GlobalStyles} from '../../../globals/GlobalStyles';
import PropTypes from 'prop-types';
import MultiSelect from 'react-native-multiple-select';
import Pagination from '../../../helpers/Pagination';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FormatUtils from '../utils/FormatUtils';
import {Icon} from 'react-native-elements';
import {Cache} from 'react-native-cache';
import AsyncStorage from '@react-native-community/async-storage';
import {StatusLabel} from './StatusLabel';

const searchPolicies = Object.freeze({
  STATIC: 'STATIC',
  DYNAMIC: 'DYNAMIC',
});

const selectModes = Object.freeze({
  SELECT: 'SELECT',
  MULTIPLE_SELECT: 'MULTIPLE_SELECT',
  SINGLE_SELECT: 'SINGLE_SELECT',
});

const selectModeSearchFieldName = 'value';
const uniqueKey = 'id';

export default class LabeledMultiSelectPicker extends Component {
  constructor(props) {
    super(props);
    this.cache = new Cache({
      namespace: this.props.objectName,
      policy: {
        maxEntries: 1000,
      },
      backend: AsyncStorage,
    });
    this.state = {
      selectedItems: [],
      items: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {selectedData, mode} = nextProps;
    let selectedItems = [];
    if (selectedData !== null) {
      switch (mode) {
        case selectModes.MULTIPLE_SELECT:
          selectedItems = selectedData.map((item) => item[uniqueKey]);
          break;
        case selectModes.SINGLE_SELECT:
          selectedItems = [selectedData[uniqueKey]];
          break;
        case selectModes.SELECT:
          selectedItems = [selectedData];
          break;
        default:
          throw new Error(`Not supported LabeledMultiSelectPicker mode: ${mode}.`);
      }
    }
    return {
      selectedItems,
    };
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({selectedItems}, () => {
      const {onChange, mode} = this.props;
      let selectedData;
      switch (mode) {
        case selectModes.SELECT:
          selectedData = selectedItems[0];
          break;
        case selectModes.SINGLE_SELECT:
          selectedData = this.state.items.find((item) => selectedItems[0] === item[uniqueKey]);
          break;
        case selectModes.MULTIPLE_SELECT:
          selectedData = this.state.items.filter((item) => selectedItems.find((el) => el === item[uniqueKey]));
          break;
      }
      onChange(selectedData);
    });
  };

  processServerResponse = async (response) => {
    // const items = [...this.state.items];
    // response.data.forEach((item) => {
    //   if (!items.some((el) => el[uniqueKey] === item[uniqueKey])) {
    //     items.push(item);
    //   }
    // });

    this.setState({
      items: response.data,
    });
  };

  processUserInput = async (searchValue, delay = 500) => {
    const {mode, searchPolicy} = this.props;
    if (searchPolicy === searchPolicies.STATIC || mode === selectModes.SELECT) {
      return;
    }
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      await this.pagination.fetchPage(this.processServerResponse, searchValue);
      this.timeout = null;
    }, delay);
  };

  fetchInitialData = () => {
    const {paginationData, mode, staticValues} = this.props;
    if (mode === selectModes.SELECT) {
      this.setState({
        items: Object.keys(staticValues).map((key) => ({
          [uniqueKey]: key,
          [selectModeSearchFieldName]: FormatUtils.formatEnumValue(staticValues[key]),
        })),
      });
      return;
    }
    this.pagination = new Pagination(paginationData);
    this.pagination.fetchPage(this.processServerResponse);
  };

  componentDidMount() {
    this.fetchInitialData();
  }

  async componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
    await this.cache.clearAll();
  }

  render() {
    const {label, paginationData, mode, fieldStatus, editable} = this.props;
    const {items, selectedItems} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>{label}</Text>
          <StatusLabel style={styles.statusLabel} status={fieldStatus} />
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.multiSelectContainer}>
            <MultiSelect
              ref={(obj) => (this.multiSelect = obj)}
              fixedHeight={true}
              items={items}
              single={mode !== selectModes.MULTIPLE_SELECT}
              canAddItems={false}
              uniqueKey={uniqueKey}
              onSelectedItemsChange={(newItems) => editable && this.onSelectedItemsChange(newItems)}
              selectedItems={selectedItems}
              styleMainWrapper={styles.multiSelectWrapper}
              styleDropdownMenu={{height: GlobalStyles.defaultFontSize * 3}}
              selectText="Pick Items"
              searchInputPlaceholderText="Search Items..."
              styleTextTag={{fontSize: GlobalStyles.smallFontSize}}
              fontSize={GlobalStyles.defaultFontSize}
              itemFontSize={GlobalStyles.defaultFontSize}
              //onChangeInput={(searchValue) => this.processUserInput(searchValue)}
              styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
              tagRemoveIconColor={GlobalStyles.violetColor}
              tagBorderColor={GlobalStyles.violetColor}
              tagTextColor={GlobalStyles.lightVioletColor}
              selectedItemTextColor={GlobalStyles.lightVioletColor}
              selectedItemIconColor={GlobalStyles.lightVioletColor}
              itemTextColor={GlobalStyles.blackTextColor}
              displayKey={paginationData ? paginationData.searchFieldName : selectModeSearchFieldName}
              submitButtonColor={GlobalStyles.lightVioletColor}
              submitButtonText="Submit"
              removeSelected
            />
          </View>
          {mode === selectModes.MULTIPLE_SELECT && (
            <TouchableOpacity onPress={() => editable && this.multiSelect._removeAllItems()} style={styles.iconContainer}>
              <Icon name={'remove'} type={'font-awesome'} color={GlobalStyles.violetIconColor} size={hp(4)} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

LabeledMultiSelectPicker.propTypes = {
  label: PropTypes.string.isRequired,
  objectName: PropTypes.string,
  selectedData: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired, PropTypes.string.isRequired]),
  fieldStatus: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  searchPolicy: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  staticValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  editable: PropTypes.bool.isRequired,
  paginationData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  dropdownMenuSubsection: {
    borderColor: GlobalStyles.lightGreyColor,
    borderRadius: 5,
    borderWidth: 1,
  },
  iconContainer: {
    padding: 5,
  },
  label: {
    color: GlobalStyles.greyTextColor,
    fontSize: GlobalStyles.defaultFontSize,
    fontWeight: 'bold',
  },
  multiSelectContainer: {
    flexGrow: 1,
  },
  multiSelectWrapper: {
    width: '90%', //flexGrow doesnt work with MultiSelect
  },
  rowContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
  },
  statusLabel: {
    marginLeft: 10,
  },
});
