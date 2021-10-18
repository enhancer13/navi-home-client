import cloneDeep from 'lodash/cloneDeep';
import EntityUtils from './utils/EntityUtils';
import {Status} from './controls/StatusLabel';

export default class Entity {
  static #idSequence = 0;
  #originalItem; //should be untouched
  #item; //is updated with new values
  #requestItem = {}; //will be used for ajax request (should contain only fields to update)
  #selected = false;

  constructor(item) {
    this.#originalItem = item;
    this.#item = cloneDeep(item);
    this.#requestItem.id = item.id;
    this.#requestItem.fieldsDeleteRequestDto = {
      fieldNames: [],
    };
  }

  static Create({objectFields}) {
    const item = EntityUtils.createDefaultItem(objectFields);
    item.id = Entity.getNextId();
    return new Entity(item);
  }

  static Copy(entity, {objectFields}) {
    const item = entity.getItem();
    const itemClone = cloneDeep(item);
    itemClone.id = Entity.getNextId();
    const searchFieldName = objectFields.find((field) => field.primarySearchField).fieldName;
    itemClone[searchFieldName] = `copy of "${item[searchFieldName]}"`;
    return new Entity(itemClone);
  }

  static getNextId() {
    return --Entity.#idSequence;
  }

  revertChanges() {
    this.#item = cloneDeep(this.#originalItem);
    this.#requestItem = {
      id: this.#item.id,
      fieldsDeleteRequestDto: {
        fieldNames: [],
      },
    };
  }

  getItem() {
    return this.#originalItem;
  }

  getRequestItem() {
    if (this.#requestItem.id < 0) {
      const requestItem = cloneDeep(this.#item);
      delete requestItem.id;
      return requestItem;
    }
    return this.#requestItem;
  }

  getFieldValue(fieldName) {
    return this.#item[fieldName];
  }

  setFieldValue(fieldName, value) {
    this.#item[fieldName] = value;
    if (this.isFieldModified(fieldName)) {
      // nullable fields with null value should be deleted over special request item
      if (value === null) {
        this.#requestItem.fieldsDeleteRequestDto.fieldNames.push(fieldName);
        delete this.#requestItem[fieldName];
        return;
      }
      this.#requestItem[fieldName] = value;
    } else {
      delete this.#requestItem[fieldName];
      const fieldsDeleteRequestDto = this.#requestItem.fieldsDeleteRequestDto;
      const index = fieldsDeleteRequestDto.fieldNames.indexOf(fieldName);
      if (index === -1) {
        return;
      }
      fieldsDeleteRequestDto.fieldNames = fieldsDeleteRequestDto.fieldNames.slice(index, 1);
    }
  }

  getFieldStatus(fieldName) {
    return this.isFieldModified(fieldName) ? Status.MODIFIED : Status.UNMODIFIED;
  }

  updateWith(entity) {
    const requestItem = entity.getRequestItem();
    Object.keys(requestItem)
      .filter((key) => key !== 'id')
      .forEach((key) => {
        this.setFieldValue(key, requestItem[key]);
      });
  }

  isFieldModified(fieldName) {
    const itemProperty = this.#item[fieldName];
    const originalItemProperty = this.#originalItem[fieldName];
    const fieldType = typeof itemProperty;
    if (fieldType === 'object' && Array.isArray(itemProperty)) {
      return EntityUtils.isCollectionUpdated(itemProperty, originalItemProperty);
    } else if (fieldType === 'object') {
      return EntityUtils.isObjectUpdated(itemProperty, originalItemProperty);
    }
    return EntityUtils.isPrimitiveUpdated(itemProperty, originalItemProperty);
  }

  getStatus() {
    if (this.isNew()) {
      return Status.NEW;
    } else if (this.isModified()) {
      return Status.MODIFIED;
    }
    return Status.UNMODIFIED;
  }

  isModified() {
    return !this.isNew() && Object.keys(this.#requestItem).length > 2; //id and fieldsDeleteRequestDto are always included
  }

  isNew() {
    return this.#originalItem.id <= 0;
  }

  isSelected() {
    return this.#selected;
  }

  setSelected(value) {
    this.#selected = value;
  }

  toggleSelected() {
    this.#selected = !this.#selected;
  }

  equals(entity) {
    return this.#originalItem.id === entity.getItem().id;
  }
}
