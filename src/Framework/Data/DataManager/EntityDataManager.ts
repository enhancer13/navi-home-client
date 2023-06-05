import {IEntity, IPage} from "../../../BackendTypes";
import {EntityDefinition} from "./EntityDefinition";
import {IEntityDataManager} from "./IEntityDataManager";
import IHttpClient from "../../Net/HttpClient/IHttpClient";
import {Authentication} from "../../../Features/Authentication";
import {CreateEntityActionRequest} from "./EntityActionRequests/CreateEntityActionRequest";
import {DeleteEntityActionRequest} from "./EntityActionRequests/DeleteEntityActionRequest";
import {UpdateEntityActionRequest} from "./EntityActionRequests/UpdateEntityActionRequest";

export interface IFilterQuery {
    sort?: string;
    search?: string;
    equal?: boolean;
    extraCondition?: { [key: string]: string };
}

export interface IPageQuery {
    page: number;
    size: number;
}

const defaultPageSize = 30;

export class EntityDataManager<TEntity extends IEntity> implements IEntityDataManager<TEntity> {
    private readonly _entityDefinition: EntityDefinition;
    private readonly _httpClient: IHttpClient;
    private readonly _authentication: Authentication;

    constructor(entityDefinition: EntityDefinition, httpClient: IHttpClient, authentication: Authentication) {
        this._entityDefinition = entityDefinition;
        this._httpClient = httpClient;
        this._authentication = authentication;
    }

    public async get(pageQuery: IPageQuery, filterQuery?: IFilterQuery): Promise<IPage<TEntity>> {
        const requestUrl = this.buildPageRequestUrl(pageQuery, filterQuery);
        return await this._httpClient.get(requestUrl, {authentication: this._authentication});
    }

    public async getById(id: number): Promise<TEntity> {
        const requestUrl = this.buildPageRequestUrl({page: 1, size: 1}, {equal: true, extraCondition: {id: id.toString()}});
        const pageData =  await this._httpClient.get<IPage<TEntity>>(requestUrl, {authentication: this._authentication});
        return pageData.data as TEntity;
    }

    public async delete(entities: Array<TEntity>): Promise<void> {
        const entityActionRequests = entities.map(x => new DeleteEntityActionRequest(x));
        const json = JSON.stringify(entityActionRequests);
        await this._httpClient.delete(this._entityDefinition.getJwtControllerUrl(), {body: json, authentication: this._authentication});
    }

    public async deleteSingle(entity: TEntity): Promise<void> {
        const entityActionRequests = [new DeleteEntityActionRequest(entity)];
        const json = JSON.stringify(entityActionRequests);
        await this._httpClient.delete(this._entityDefinition.getJwtControllerUrl(), {body: json, authentication: this._authentication});
    }

    public async insert(entities: Array<TEntity>): Promise<IPage<TEntity>> {
        const createEntityActionRequests = entities.map(x => new CreateEntityActionRequest(x, this._entityDefinition));
        const json = JSON.stringify(createEntityActionRequests);
        return await this._httpClient.post(this._entityDefinition.getJwtControllerUrl(), {body: json, authentication: this._authentication});
    }

    public async update(entities: Array<TEntity>, modifiedFieldNames: string[][]): Promise<IPage<TEntity>> {
        const entityActionRequests = entities.map((x, index) => new UpdateEntityActionRequest(x, modifiedFieldNames[index]));
        const json = JSON.stringify(entityActionRequests);
        return await this._httpClient.put(this._entityDefinition.getJwtControllerUrl(), {body: json, authentication: this._authentication});
    }

    public async updateSingle(entity: TEntity, modifiedFieldNames: string[]): Promise<TEntity> {
        const entityActionRequest = new UpdateEntityActionRequest(entity, modifiedFieldNames);
        const json = JSON.stringify([entityActionRequest]);
        return await this._httpClient.put(this._entityDefinition.getJwtControllerUrl(), {body: json, authentication: this._authentication});
    }

    public get entityDefinition(): EntityDefinition {
        return this._entityDefinition;
    }

    private buildPageRequestUrl(pageQuery: IPageQuery, filterQuery?: IFilterQuery) {
        //`&${parentPrimarySearchField}=${parentEntity[parentPrimarySearchField]}`
        let url = `${this._entityDefinition.getJwtControllerUrl()}?page=${pageQuery.page ?? 1}&size=${pageQuery.size ?? defaultPageSize}` +
            `&sort=${filterQuery?.sort ?? this._entityDefinition.getPrimarySortFieldName()},desc` +
            `&${this._entityDefinition.getPrimarySearchFieldName()}=${filterQuery?.search ?? ''}&equal=${filterQuery?.equal ?? false}`;

        if (filterQuery?.extraCondition) {
            for (const key in filterQuery.extraCondition) {
                url += `&${key}=${filterQuery.extraCondition[key]}`;
            }
        }
        return url;
    }
}
