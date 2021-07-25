// noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Entity from './Entity';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {GlobalStyles} from '../../globals/GlobalStyles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ActionsBar from './ActionsBar';
import LabeledSwitch from './controls/LabeledSwitch';
import LabeledInput from './controls/LabeledInput';
import LabeledDateTimePicker from './controls/LabeledDateTimePicker';
import LabeledMultiSelectPicker from './controls/LabeledMultiSelectPicker';
import FieldDataType from './FieldDataType';
import {Status} from './controls/StatusLabel';

// noinspection JSUnresolvedVariable
export default class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  renderField = ({item}) => {
    const {fieldDataType, fieldTitle, fieldName, searchPolicy, fieldEnumValues, objectName} = item;
    const {entity, isActive} = this.state;
    const inputEnabled = !item.inputDisabled && isActive;
    const fieldValue = entity.getFieldValue(fieldName);
    const fieldStatus = entity.getStatus() !== Status.NEW ? entity.getFieldStatus(fieldName) : Status.UNMODIFIED;
    switch (fieldDataType) {
      case FieldDataType.TEXT:
      case FieldDataType.NUMBER:
      case FieldDataType.PASSWORD:
        return (
          <LabeledInput
            keyboardType={fieldDataType === FieldDataType.NUMBER ? 'numeric' : 'default'}
            editable={inputEnabled}
            secureTextEntry={fieldDataType === FieldDataType.PASSWORD}
            label={fieldTitle}
            value={fieldValue.toString()}
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
      case FieldDataType.SELECT:
        const paginationData = fieldDataType === FieldDataType.SELECT ? null : this.props.entityEditorData.GetPaginationData(objectName);
        return (
          <LabeledMultiSelectPicker
            label={fieldTitle}
            fieldStatus={fieldStatus}
            objectName={objectName}
            selectedData={fieldValue}
            mode={fieldDataType}
            editable={inputEnabled}
            searchPolicy={searchPolicy}
            staticValues={fieldEnumValues}
            paginationData={paginationData}
            onChange={(val) => this.updateFieldValue(fieldName, val)}
          />
        );
      default:
        throw new Error(`Not supported field data type: ${FieldDataType[fieldDataType]}`);
    }
  };

  buildFlatListData = ({objectFields, auditable}) => {
    const fields = [...objectFields];
    fields.sort((a, b) => {
      return a.rowGroup - b.rowGroup || a.fieldOrder - b.fieldOrder;
    });
    // if (auditable) {
    //   fields.push({
    //     fieldDataType: FieldDataType.DIVIDER,
    //     fieldTitle: 'Auditable Data',
    //     fieldName: 'divider-' + sequence++,
    //   });
    //   Object.keys(auditable).forEach((fieldName) => {
    //     const title = fieldName.split(/(?=[A-Z])/).join(' ');
    //     fields.push({
    //       fieldDataType: FieldDataType.TEXT,
    //       fieldTitle: title[0].toUpperCase() + title.slice(1),
    //       inputDisabled: true,
    //       fieldName,
    //     });
    //   });
    // }
    return fields;
  };

  render() {
    const {title, onSave, onCopy, onDelete, onClose, entityData} = this.props;
    const {entity, isActive} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.titleText, {opacity: this.state.titleTextOpacity}]}>{title}</Text>
          <ActionsBar
            onSave={() => onSave([entity])}
            onCopy={() => onCopy([entity])}
            onDelete={() => onDelete([entity])}
            onClose={() => onClose(entity)}
            onRevert={this.revertChanges}
            style={styles.actionsBar}
            allowedActions={isActive ? {...entityData.databaseMethods} : {}}
            selectionActions={false}
          />
        </View>
        <View style={styles.flatList}>
          <FlatList keyExtractor={(field) => field.fieldName.toString()} data={this.buildFlatListData(entityData)} renderItem={this.renderField} />
        </View>
      </View>
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
  actionsBar: {
    alignSelf: 'flex-start',
    borderTopColor: GlobalStyles.lightBackgroundColor,
    borderTopWidth: 2,
    height: hp(5),
  },
  container: {
    flex: 1,
  },
  flatList: {
    alignSelf: 'center',
    backgroundColor: '#f4f3ff',
    borderColor: GlobalStyles.violetColor,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    margin: 10,
    padding: 10,
    width: '95%',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: GlobalStyles.violetBackgroundColor,
    elevation: 5,
    flexDirection: 'column',
    height: hp(10),
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  titleText: {
    alignSelf: 'flex-start',
    color: GlobalStyles.whiteTextColor,
    fontSize: GlobalStyles.defaultTitleFontSize,
  },
});
