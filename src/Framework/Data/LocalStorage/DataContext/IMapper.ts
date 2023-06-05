import {IStorageItem} from "../IStorageItem";

export interface IMapper<TStorageItem extends IStorageItem> {
    map(data: unknown): TStorageItem;

    mapArray(data: unknown[]): TStorageItem[];
}
