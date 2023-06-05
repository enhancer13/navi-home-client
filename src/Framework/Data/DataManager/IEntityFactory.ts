import {IEntity} from "../../../BackendTypes";
import {IEntityDefinition} from "./IEntityDefinition";

export interface IEntityFactory {
    create(entityDefinition: IEntityDefinition): IEntity;

    getNextId(entityName: string): number;

    resetIdSequence(entityName: string): void
}
