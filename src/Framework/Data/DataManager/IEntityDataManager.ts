import {IEntity, IPage} from "../../../BackendTypes";
import {IFilterQuery, IPageQuery} from "./EntityDataManager";
import {IEntityDefinition} from "./IEntityDefinition";

export interface IEntityDataManager<TEntity extends IEntity> {
    get(pageQuery: IPageQuery, filterQuery?: IFilterQuery): Promise<IPage<TEntity>>;

    getById(id: number): Promise<TEntity>;

    insert(entities: Array<TEntity>): Promise<IPage<TEntity>>;

    update(entities: Array<TEntity>, modifiedFieldNames: string[][]): Promise<IPage<TEntity>>;

    updateSingle(entity: TEntity, modifiedFieldNames: string[]): Promise<TEntity>;

    delete(entities: Array<TEntity>): Promise<void>;

    deleteSingle(entity: TEntity): Promise<void>;

    get entityDefinition(): IEntityDefinition;
}

