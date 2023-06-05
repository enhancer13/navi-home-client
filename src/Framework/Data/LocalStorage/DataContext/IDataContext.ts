import {IStorageItem} from '../IStorageItem';

export interface IDataContext<TStorageItem extends IStorageItem> {
  save(entity: TStorageItem): Promise<void>;

  saveMultiple(entities: Array<TStorageItem>): Promise<void>;

  getBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<TStorageItem | undefined>;

  getAll(): Promise<Array<TStorageItem>>;

  update(entity: TStorageItem): Promise<void>;

  deleteBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<void>;

  delete(entity: TStorageItem): Promise<void>;

  deleteAll(): Promise<void>;

  count(): Promise<number>;
}
