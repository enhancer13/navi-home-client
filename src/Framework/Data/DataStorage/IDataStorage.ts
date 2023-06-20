import {IStorageItem} from './IStorageItem';
import {DataStorageEventTypes} from "./DataStorage";

export default interface IDataStorage<TStorageItem extends IStorageItem> {
  save(item: TStorageItem): Promise<void>;

  saveMultiple(items: Array<TStorageItem>): Promise<void>;

  getBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => unknown): Promise<TStorageItem | undefined>;

  getAll(): Promise<Array<TStorageItem>>;

  update(item: TStorageItem): Promise<void>;

  deleteBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => unknown): Promise<void>;

  delete(item: TStorageItem): Promise<void>;

  deleteAll(): Promise<void>;

  count(): Promise<number>;

  on(event: DataStorageEventTypes, listener: (args?: any) => void): void;

  off(event: DataStorageEventTypes, listener: (args?: any) => void): void;
}
