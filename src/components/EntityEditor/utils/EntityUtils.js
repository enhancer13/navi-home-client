import FieldDataType from '../FieldDataType';

export default class EntityUtils {
  static isPrimitiveUpdated = (value, originalValue) => {
    if (value === null && originalValue === null) {
      return false;
    }
    if (value === null || originalValue === null) {
      return true;
    }
    return value !== originalValue;
  };

  static isObjectUpdated = (object, originalObject) => {
    if (object === null && originalObject === null) {
      return false;
    }
    if (object === null || originalObject === null) {
      return true;
    }
    return object.id !== originalObject.id;
  };

  static isCollectionUpdated = (array, originalArray) => {
    if (array === null && originalArray === null) {
      return false;
    }
    if (array === null || originalArray === null) {
      return true;
    }
    if (array.length !== originalArray.length) {
      return true;
    }
    return array.some(
      (item) =>
        !originalArray.some((origItem) => {
          if (typeof item !== 'object') {
            return origItem === item;
          }
          return origItem.id === item.id;
        }),
    );
  };

  static createDefaultItem(fields) {
    const item = {};
    fields.forEach((field) => {
      const {fieldDataType, fieldName, fieldEnumValues, primarySearchField} = field;
      switch (fieldDataType) {
        case FieldDataType.TEXT:
        case FieldDataType.PASSWORD:
          item[fieldName] = primarySearchField ? 'new entity' : '';
          break;
        case FieldDataType.NUMBER:
          item[fieldName] = 0;
          break;
        case FieldDataType.CHECKBOX:
          item[fieldName] = false;
          break;
        case FieldDataType.DATE:
        case FieldDataType.TIME:
        case FieldDataType.DATETIME:
          item[fieldName] = null;
          break;
        case FieldDataType.SELECT:
          item[fieldName] = fieldEnumValues[0];
          break;
        case FieldDataType.SINGLE_SELECT:
          item[fieldName] = null;
          break;
        case FieldDataType.MULTIPLE_SELECT:
          item[fieldName] = [];
          break;
        default:
          throw new Error(`Not supported field data type: ${FieldDataType[fieldDataType]} ${fieldDataType}`);
      }
    });
    console.log(item);
    return item;
  }
}
