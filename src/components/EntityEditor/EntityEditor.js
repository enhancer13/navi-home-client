// noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Entity from './Entity';
import {Animated, Modal, Platform, StyleSheet, View} from 'react-native';
import {GlobalStyles} from '../../config/GlobalStyles';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionsBar from './ActionsBar';
import LabeledSwitch from './controls/LabeledSwitch';
import LabeledInput from './controls/LabeledInput';
import LabeledDateTimePicker from './controls/LabeledDateTimePicker';
import LabeledAjaxDropDownListPicker from './controls/LabeledAjaxDropDownListPicker';
import LabeledDropDownListSinglePicker from './controls/LabeledDropDownListSinglePicker';
import FieldDataType from './FieldDataType';
import {Status} from './controls/StatusLabel';
import FlexContainer from '../View/FlexContainer';
import {Divider, Surface} from 'react-native-paper';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TouchableScale from 'react-native-touchable-scale';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {StringUtils} from '../../helpers/StringUtils';

//https://snack.expo.dev/@rborn/animated-flatlist-and-header
//https://medium.com/appandflow/react-native-collapsible-navbar-e51a049b560a
const DESCRIPTION_HEIGHT = hp(10);
const HEADER_HEIGHT = hp(5);
const BACK_ICON_SIZE = 30;
const ACTIONS_BAR_HEIGHT = hp(5);

// noinspection JSUnresolvedVariable
export default class EntityEditor extends Component {
  constructor(props) {
    super(props);

    const scrollAnim = new Animated.Value(0);
    const fontWeightAnimation = new Animated.Value(300);
    this.state = {
      scrollAnim,
      fontWeightAnimation
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.entity) {
      const {entity, entityData} = nextProps;
      return {
        entity,
        entityData,
        isActive: true,
      };
    }
    return {
      isActive: false,
    };
  }

  updateFieldValue = (fieldName, value) => {
    this.setState((prevState) => {
      const entity = prevState.entity;
      entity.setFieldValue(fieldName, value);
      return {
        entity,
      };
    });
  };

  revertChanges = () => {
    this.setState((prevState) => {
      const {entity} = prevState;
      entity.revertChanges();
      return {
        entity,
      };
    });
  };

  renderGroup = ({item}) => {
    return (<Surface style={styles.group} key={item.key}>
      {item.group.map(this.renderField).map((field, index) => {
        return (
          <View key={item.key + index}>
            <View style={{ minHeight: hp(8), justifyContent: 'center'}}>
              {field}
            </View>
            <Divider/>
          </View>
        );
      })}
    </Surface>);
  };

  renderField = (item) => {
    const {
      fieldDataType,
      fieldTitle,
      fieldName,
      searchPolicy,
      fieldEnumValues,
      objectName,
    } = item;
    const {entity, isActive} = this.state;
    const inputEnabled = !item.inputDisabled && isActive;
    const fieldValue = entity.getFieldValue(fieldName);
    const fieldStatus =
      entity.getStatus() !== Status.NEW
        ? entity.getFieldStatus(fieldName)
        : Status.UNMODIFIED;
    switch (fieldDataType) {
      case FieldDataType.TEXT:
      case FieldDataType.NUMBER:
      case FieldDataType.PASSWORD:
        return (
          <LabeledInput
            keyboardType={
              fieldDataType === FieldDataType.NUMBER ? 'numeric' : 'default'
            }
            editable={inputEnabled}
            secureTextEntry={fieldDataType === FieldDataType.PASSWORD}
            label={fieldTitle}
            value={fieldValue !== null ? fieldValue.toString() : ''}
            fieldStatus={fieldStatus}
            onChangeText={(value) => this.updateFieldValue(fieldName, value)}
          />
        );
      case FieldDataType.CHECKBOX:
        return (
          <LabeledSwitch
            label={fieldTitle}
            editable={inputEnabled}
            value={fieldValue}
            fieldStatus={fieldStatus}
            onValueChange={(value) => this.updateFieldValue(fieldName, value)}
          />
        );
      case FieldDataType.DATE:
      case FieldDataType.TIME:
      case FieldDataType.DATETIME:
        return (
          <LabeledDateTimePicker
            label={fieldTitle}
            value={fieldValue}
            editable={inputEnabled}
            fieldStatus={fieldStatus}
            mode={fieldDataType}
            onChange={(val) => this.updateFieldValue(fieldName, val)}
          />
        );
      case FieldDataType.MULTIPLE_SELECT:
      case FieldDataType.SINGLE_SELECT:
        const paginationData = this.props.entityEditorData.GetPaginationData(objectName);
        return (
          <LabeledAjaxDropDownListPicker
            label={fieldTitle}
            fieldStatus={fieldStatus}
            selectedData={fieldValue}
            onChange={(val) => this.updateFieldValue(fieldName, val)}
            editable={inputEnabled}
            paginationData={paginationData}
            multiple={fieldDataType === FieldDataType.MULTIPLE_SELECT}
            itemLabelFormatter={searchPolicy === 'STATIC' ? StringUtils.snakeToPascal : undefined}
          />
        );
      case FieldDataType.SELECT:
        return (
          <LabeledDropDownListSinglePicker
            label={fieldTitle}
            fieldStatus={fieldStatus}
            selectedItem={fieldValue}
            items={Object.keys(fieldEnumValues).map(key => fieldEnumValues[key])}
            onChange={(val) => this.updateFieldValue(fieldName, val)}
            editable={inputEnabled}
            itemLabelFormatter={searchPolicy === 'STATIC' ? StringUtils.snakeToPascal : undefined}
          />);
      default:
        throw new Error(
          `Not supported field data type: ${FieldDataType[fieldDataType]}`,
        );
    }
  };

  buildFlatListData = ({objectFields, auditable}) => {
    const fields = [...objectFields];
    fields.sort((a, b) => {
      return a.rowGroup - b.rowGroup || a.fieldOrder - b.fieldOrder;
    });


    const groupBy = function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    const data = groupBy(fields, 'rowGroup');
    return Object.keys(data).map(key => {
      return {
        key,
        group: data[key],
      };
    });
  };

  render() {
    const {title, onSave, onCopy, onDelete, onClose, entityData} = this.props;
    const {entity, isActive, scrollAnim} = this.state;

    const navbarTranslate = scrollAnim.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp',
    });

    const navbarHeight = scrollAnim.interpolate({
      inputRange: [HEADER_HEIGHT, DESCRIPTION_HEIGHT],
      outputRange: [DESCRIPTION_HEIGHT, HEADER_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerTextColor = scrollAnim.interpolate({
      inputRange: [HEADER_HEIGHT, DESCRIPTION_HEIGHT],
      outputRange: [GlobalStyles.violetTextColor, GlobalStyles.whiteTextColor],
      extrapolate: 'clamp',
    });

    const headerTextSize = scrollAnim.interpolate({
      inputRange: [0, DESCRIPTION_HEIGHT],
      outputRange: [30, 20],
      extrapolate: 'clamp',
    });

    return (
      <Modal
        visible={this.props.visible}
        transparent={false}
        animationType={'slide'}
      >
        <SafeAreaInsetsContext.Consumer>
          {(insets) => {
            const top = Platform.OS === 'ios' ? insets.top : 0;
            return (
              <FlexContainer style={{
                backgroundColor: GlobalStyles.lightBackgroundColor,
                paddingTop: top,
                paddingBottom: insets.bottom,
              }}>
                <View style={{...styles.topSafeArea, height: top}}/>
                <View style={{...styles.bottomSafeArea, height: insets.bottom}}/>
                <FlexContainer>
                  <View style={styles.headerContainer}>
                    <TouchableScale onPress={() => onClose(entity)}>
                      <Ionicon name="arrow-back" color={'white'} size={BACK_ICON_SIZE}/>
                    </TouchableScale>
                  </View>

                  <Animated.View
                    style={[styles.navbar, {transform: [{translateY: navbarTranslate}], height: navbarHeight}]}>
                    <Animated.Text style={{fontSize: headerTextSize, color: headerTextColor}}>
                      {title}
                    </Animated.Text>
                  </Animated.View>
                  <FlexContainer bottomTransparency topTransparency>
                    <Animated.FlatList
                      contentContainerStyle={{paddingTop: DESCRIPTION_HEIGHT}}
                      scrollEventThrottle={16}
                      bounces={false}
                      onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                        {useNativeDriver: false},
                      )}
                      keyExtractor={(group) => group.key.toString()}
                      data={this.buildFlatListData(entityData)}
                      renderItem={this.renderGroup}
                    />
                  </FlexContainer>
                  <View style={styles.actionsBar}>
                    <ActionsBar
                      onSave={() => onSave([entity])}
                      onCopy={() => onCopy([entity])}
                      onDelete={() => onDelete([entity])}
                      onClose={() => onClose(entity)}
                      onRevert={this.revertChanges}
                      containerStyle={styles.actionsBarContainer}
                      iconStyle={styles.actionsBarIcon}
                      allowedActions={isActive ? {...entityData.databaseMethods} : {}}
                      selectionActions={false}
                    />
                  </View>
                </FlexContainer>
              </FlexContainer>
            );
          }}
        </SafeAreaInsetsContext.Consumer>
      </Modal>
    );
  }
}

EntityEditor.propTypes = {
  title: PropTypes.string.isRequired,
  entityData: PropTypes.object.isRequired,
  entityEditorData: PropTypes.object.isRequired,
  entity: PropTypes.instanceOf(Entity),
  onSave: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  topSafeArea: {
    position: 'absolute',
    width: '100%',
    backgroundColor: GlobalStyles.violetBackgroundColor,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    zIndex: 1
  },
  navbar: {
    marginTop: HEADER_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100) - BACK_ICON_SIZE * 2,
  },
  actionsBar: {
    width: '100%',
  },
  actionsBarContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'flex-start',
    borderTopColor: GlobalStyles.transparentBackgroundColor,
    borderTopWidth: 0,
    backgroundColor: GlobalStyles.violetBackgroundColor,
    height: ACTIONS_BAR_HEIGHT,
  },
  actionsBarIcon: {
    iconColor: GlobalStyles.lightIconColor,
  },
  group: {
    borderRadius: 10,
    margin: 10,
    flex: 1,
    padding: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    elevation: 4
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    flexDirection: 'row'
  },
  titleText: {
    alignSelf: 'flex-start',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultTitleFontSize,
  }
});
