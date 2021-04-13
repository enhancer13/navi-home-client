import AsyncStorage from '@react-native-community/async-storage';
import Globals from '../globals/Globals';
import Defaults from '../defaults/Defaults';

export default class Storage {
  static getTextItem = async (name) => {
    let defaultValue = '';
    try {
      return (await AsyncStorage.getItem(name)) ?? defaultValue;
    } catch (e) {
      console.warn(`Unable to read text item: ${name} from AsyncStorage`);
    }
    return defaultValue;
  };

  static getBooleanItem = async (name) => {
    try {
      return !!JSON.parse(await Storage.getTextItem(name));
    } catch (e) {
      console.warn('Unable to parse JSON for boolean item: ' + name);
    }
    return false;
  };

  static getListItem = async (name) => {
    let defaultValue = [];
    try {
      let value = await Storage.getTextItem(name);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.warn('Unable to parse JSON for array: ' + name);
    }
    return defaultValue;
  };

  static setTextItem = async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (e) {
      console.warn(`Unable to save text item: ${name}, ${value} in AsyncStorage`);
    }
  };

  static setBooleanItem = async (name, value) => {
    await Storage.setTextItem(name, JSON.stringify(value));
  };

  static addListItem = async (name, value) => {
    let items = await Storage.getListItem(name);
    if (Array.isArray(value)) {
      items.push(...value);
    } else {
      items.push(value);
    }
    await Storage.setTextItem(name, JSON.stringify(items));
  };

  static updateListItem = async (name, obj, attr, oldAttrValue) => {
    let items = await Storage.getListItem(name);
    let index = items.map((s) => s[attr]).indexOf(oldAttrValue);
    items[index] = obj;
    await Storage.setTextItem(name, JSON.stringify(items));
  };

  static removeListItem = async (name, attrValue, attr) => {
    let items = await Storage.getListItem(name);
    let index = items.map((s) => s[attr]).indexOf(attrValue);
    if (index >= 0) {
      items.splice(index, 1);
      await Storage.setTextItem(name, JSON.stringify(items));
    } else {
      console.warn('Unable to remove element from list in AsyncStorage.');
    }
  };

  static containsItem = async (name) => {
    return (await AsyncStorage.getItem(name)) !== null;
  };

  static removeItem = async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.warn(`Unable to remove item: ${name} from AsyncStorage`);
    }
  };

  static multiRemoveItems = async (...args) => {
    try {
      await AsyncStorage.multiRemove(args);
    } catch (e) {
      console.warn('Unable to remove multiple items from AsyncStorage');
    }
  };

  static initializeStorage = async () => {
    if (!(await Storage.getBooleanItem(Globals.STORAGE_INITIALIZED))) {
      await Storage.setBooleanItem(Globals.DARK_STYLE_ACTIVE, false);
      await Storage.setBooleanItem(Globals.FINGERPRINT_ACTIVE, false);
      await Storage.addListItem(Globals.SERVERS, Defaults.SERVERS);
      await Storage.setBooleanItem(Globals.STORAGE_INITIALIZED, true);
    }
  };
}
