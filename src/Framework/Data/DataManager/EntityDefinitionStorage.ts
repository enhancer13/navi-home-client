import {EntityDefinition} from "./EntityDefinition";
import LocalStorage from "../LocalStorage/LocalStorage";
import {EntityDefinitionMapper} from "./EntityDefinitionMapper";

export class EntityDefinitionStorage extends LocalStorage<EntityDefinition> {
    constructor() {
        super("entity_definitions", new EntityDefinitionMapper());
    }
}
