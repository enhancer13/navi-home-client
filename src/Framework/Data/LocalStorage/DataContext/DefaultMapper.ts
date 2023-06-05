import {IMapper} from "./IMapper";
import {IStorageItem} from "../IStorageItem";

export class DefaultMapper<TStorageItem extends IStorageItem> implements IMapper<TStorageItem> {
    map(data: unknown): TStorageItem {
        return data as TStorageItem;
    }

    mapArray(data: unknown[]): TStorageItem[] {
        return data as TStorageItem[];
    }
}
