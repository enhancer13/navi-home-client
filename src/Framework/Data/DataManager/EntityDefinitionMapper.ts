import {EntityDefinition} from './EntityDefinition';
import {IMapper} from '../DataStorage/DataContext/IMapper';
import IEntityDefinition from '../../../BackendTypes/EntityEditor/IEntityDefinition';

export class EntityDefinitionMapper implements IMapper<EntityDefinition> {
    public map(data: unknown): EntityDefinition {
        if (!this.isIEntityDefinition(data)) {
            throw new Error(`Unable to map data to EntityDefinition. Data: ${JSON.stringify(data)}`);
        }

        const entityDefinitionData = data as IEntityDefinition;
        return new EntityDefinition(entityDefinitionData.objectName, entityDefinitionData.objectFields, entityDefinitionData.controllerUrls, entityDefinitionData.databaseMethods, entityDefinitionData.auditable, entityDefinitionData.displayOnlyTable);
    }

    public mapArray(data: unknown[]): EntityDefinition[] {
        if (!data) {
            return [];
        }
        return data.map(x => this.map(x));
    }

    private isIEntityDefinition(data: unknown): data is IEntityDefinition {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        const maybeEntityDefinition = data as Partial<IEntityDefinition>;
        return 'objectName' in maybeEntityDefinition &&
            'objectFields' in maybeEntityDefinition &&
            'databaseMethods' in maybeEntityDefinition &&
            'auditable' in maybeEntityDefinition &&
            'controllerUrls' in maybeEntityDefinition &&
            'displayOnlyTable' in maybeEntityDefinition;
    }
}
