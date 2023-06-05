import ILocalStorage from './ILocalStorage';
import {IStorageItem} from './IStorageItem';
import {IDataContext} from './DataContext/IDataContext';
import {DataContext} from './DataContext/DataContext';
import {IMapper} from "./DataContext/IMapper";
import {DefaultMapper} from "./DataContext/DefaultMapper";
import {EventEmitter} from "events";

export enum LocalStorageEventTypes {
    DataChanged = 'dataChanged',
    DataCreated = 'dataCreated'
}

export default class LocalStorage<TStorageItem extends IStorageItem> implements ILocalStorage<TStorageItem> {
    protected readonly dataContext: IDataContext<TStorageItem>;
    private _eventEmitter: EventEmitter;

    constructor(contextName: string, mapper?: IMapper<TStorageItem>) {
        if (!mapper) {
            mapper = new DefaultMapper<TStorageItem>();
        }
        this.dataContext = new DataContext(contextName, mapper);
        this._eventEmitter = new EventEmitter();
    }

    public async save(entity: TStorageItem): Promise<void> {
        await this.dataContext.save(entity);
        this._eventEmitter.emit(LocalStorageEventTypes.DataCreated, entity);
    }

    public async saveMultiple(entities: Array<TStorageItem>): Promise<void> {
        await this.dataContext.saveMultiple(entities);
        this._eventEmitter.emit(LocalStorageEventTypes.DataCreated, entities);
    }

    public async getBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<TStorageItem | undefined> {
        return this.dataContext.getBy(predicate);
    }

    public async getAll(): Promise<Array<TStorageItem>> {
        return this.dataContext.getAll();
    }

    public async update(entity: TStorageItem): Promise<void> {
        await this.dataContext.update(entity);
        this._eventEmitter.emit(LocalStorageEventTypes.DataChanged, entity);
    }

    public async deleteBy(predicate: (value: TStorageItem, index: number, array: TStorageItem[]) => boolean): Promise<void> {
        await this.dataContext.deleteBy(predicate);
    }

    public async delete(entity: TStorageItem): Promise<void> {
        await this.dataContext.delete(entity);
    }

    public async deleteAll(): Promise<void> {
        await this.dataContext.deleteAll();
    }

    public async count(): Promise<number> {
        return this.dataContext.count();
    }

    public on(event: LocalStorageEventTypes, listener: (args?: any) => void): void {
        this._eventEmitter.on(event, listener);
    }

    public off(event: LocalStorageEventTypes, listener: (args?: any) => void): void {
        this._eventEmitter.off(event, listener);
    }
}
