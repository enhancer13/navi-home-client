import {IStorageItem} from './IStorageItem';
import {VolatileDataCollectionEventTypes} from "../DataManager";
import {LocalStorageEventTypes} from "./LocalStorage";

export default interface ILocalStorage<TStorageItem extends IStorageItem> {
  save(item: TStorageItem): Promise<void>;

  saveMultiple(items: Array<TStorageItem>): Promise<void>;

  getBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => unknown): Promise<TStorageItem | undefined>;

  getAll(): Promise<Array<TStorageItem>>;

  update(item: TStorageItem): Promise<void>;

  deleteBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => unknown): Promise<void>;

  delete(item: TStorageItem): Promise<void>;

  deleteAll(): Promise<void>;

  count(): Promise<number>;

  on(event: LocalStorageEventTypes, listener: (args?: any) => void): void;

  off(event: LocalStorageEventTypes, listener: (args?: any) => void): void;
}
