import IDataStorage from "../../Framework/Data/DataStorage/IDataStorage";
import {IStorageItem} from "../../Framework/Data/DataStorage";

export class DataStorageFactory {
    private static instances: Map<new () => IDataStorage<IStorageItem>, IDataStorage<IStorageItem>> = new Map();

    public static create<T extends IDataStorage<IStorageItem>>(type: new () => T): T {
        let instance = this.instances.get(type);
        if (!instance) {
            instance = new type();
            this.instances.set(type, instance);
        }
        return instance as T;
    }
}
