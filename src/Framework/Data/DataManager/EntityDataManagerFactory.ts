import {IEntityDataManager} from "./IEntityDataManager";
import {IEntity} from "../../../BackendTypes";
import {EntityDataManager} from "./EntityDataManager";
import {EntityDefinitionStorage} from "./EntityDefinitionStorage";
import {httpClient} from "../../Net/HttpClient/HttpClient";
import {Authentication} from "../../../Features/Authentication";
import IDataStorage from "../DataStorage/IDataStorage";
import {EntityDefinition} from "./EntityDefinition";
import IHttpClient from "../../Net/HttpClient/IHttpClient";
import {backendEndpoints} from "../../../Config/BackendEndpoints";
import {IEntityDefinition} from "./IEntityDefinition";

class EntityDataManagerFactory {
    private readonly _localStorage: IDataStorage<EntityDefinition>;
    private readonly _httpClient: IHttpClient

    constructor(localStorage: IDataStorage<EntityDefinition>, httpClient: IHttpClient) {
        this._localStorage = localStorage;
        this._httpClient = httpClient;
    }

    public async getDataManager<TEntity extends IEntity>(entityName: string, authentication: Authentication): Promise<IEntityDataManager<TEntity>> {
        if (await this._localStorage.count() === 0) {
            await this.initializeLocalStorage(authentication);
        }

        const entityDefinition = await this._localStorage.getBy(x => x.key === entityName);
        if (!entityDefinition) {
            throw new Error(`Invalid operation, entity definition for entity name: ${entityName} cannot be found`)
        }
        return new EntityDataManager<TEntity>(entityDefinition, this._httpClient, authentication);
    }

    private async initializeLocalStorage(authentication: Authentication) {
        const entityDefinitions = await httpClient.get<IEntityDefinition[]>(backendEndpoints.ENTITY_EDITOR_DATA, {authentication});
        await this._localStorage.saveMultiple(entityDefinitions as EntityDefinition[]);
    }
}

const localStorage = new EntityDefinitionStorage();
const entityDataManagerFactory = new EntityDataManagerFactory(localStorage, httpClient);
export {entityDataManagerFactory};
