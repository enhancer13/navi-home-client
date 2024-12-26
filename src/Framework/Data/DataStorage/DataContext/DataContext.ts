import {IStorageItem} from '../IStorageItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IDataContext} from './IDataContext';
import {IMapper} from "./IMapper";

export class DataContext<TStorageItem extends IStorageItem> implements IDataContext<TStorageItem> {
  protected readonly _contextName: string;
  private _mapper: IMapper<TStorageItem>;

  constructor(contextName: string, mapper: IMapper<TStorageItem>) {
    this._contextName = contextName;
    this._mapper = mapper;
  }

  public async save(entity: TStorageItem): Promise<void> {
    const keys = await this.getNextKeys(1);
    entity.key = keys[0];
    await AsyncStorage.setItem(entity.key, JSON.stringify(entity));
  }

  public async saveMultiple(entities: Array<TStorageItem>): Promise<void> {
    if (entities.length === 0) {
      return Promise.resolve();
    }
    const keys = await this.getNextKeys(entities.length);
    entities.forEach((entity, index) => (entity.key = keys[index]));
    await AsyncStorage.multiSet(entities.map(x => [x.key, JSON.stringify(x)]));
  }

  public async getBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<TStorageItem | undefined> {
    const entities = await this.getAll();
    return this._mapper.map(entities.find(predicate));
  }

  public async getAll(): Promise<Array<TStorageItem>> {
    const keys = await this.getAllKeys();
    if (keys.length === 0) {
      return [];
    }
    const keyValuePairs = await AsyncStorage.multiGet(keys);
    return this._mapper.mapArray(keyValuePairs
      .filter(([, value]) => value !== null)
      .map(([, value]) => value && JSON.parse(value)) as TStorageItem[]);
  }

  public async update(entity: TStorageItem): Promise<void> {
    const key = entity.key;
    if (!(key && key.startsWith(this._contextName))) {
      throw new Error(`Unable to update ${this._contextName} cause key is invalid ${key}`);
    }
    await AsyncStorage.setItem(key, JSON.stringify(entity));
  }

  public async delete(entity: TStorageItem): Promise<void> {
    return AsyncStorage.removeItem(entity.key);
  }

  public async deleteBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<void> {
    const entity = await this.getBy(predicate);
    if (!entity) {
      throw new Error(
        `Unable to delete ${this._contextName} cause entity doesn't exist ${predicate}`,
      );
    }
    await AsyncStorage.removeItem(entity.key);
  }

  public async deleteAll(): Promise<void> {
    const keys = await this.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  }

  private async getAllKeys(): Promise<Array<string>> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(x => x.startsWith(this._contextName));
  }

  private async getNextKeys(count = 1): Promise<Array<string>> {
    const keys = await this.getAllKeys();
    let nextSerialNumber = 1;
    if (keys.length !== 0) {
      const serialNumbers = keys.map(x => parseInt(x.slice(0, this._contextName.length)));
      nextSerialNumber = Math.max(...serialNumbers) + 1;
    }
    return Array.from(Array(count).keys()).map(() => `${this._contextName}_${nextSerialNumber++}`);
  }

  async count(): Promise<number> {
    return (await this.getAllKeys()).length;
  }
}
