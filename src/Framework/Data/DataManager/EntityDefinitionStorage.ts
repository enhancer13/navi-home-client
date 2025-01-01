import {EntityDefinition} from './EntityDefinition';
import DataStorage from '../DataStorage/DataStorage';
import {EntityDefinitionMapper} from './EntityDefinitionMapper';

export class EntityDefinitionStorage extends DataStorage<EntityDefinition> {
    constructor() {
        super('entity_definitions', new EntityDefinitionMapper());
    }
}
