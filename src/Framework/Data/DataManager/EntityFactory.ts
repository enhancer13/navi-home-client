import IEntityDefinition from '../../../BackendTypes/EntityEditor/IEntityDefinition';
import {IEntity, EntityFieldInputTypes} from '../../../BackendTypes';
import {IEntityFactory} from './IEntityFactory';

export class EntityFactory implements IEntityFactory {
    private static _entityIdSequences = new Map<string, number>();

    public create(entityDefinition: IEntityDefinition): IEntity {
        const entity: IEntity = { id: this.getNextId(entityDefinition.objectName) };
        entityDefinition.objectFields.forEach(field => {
            if (field.fieldName === 'id') {
                return;
            }

            const {fieldDataType, fieldName, fieldEnumValues, primarySearchField} = field;
            switch (fieldDataType) {
                case EntityFieldInputTypes.TEXT:
                case EntityFieldInputTypes.PASSWORD:
                case EntityFieldInputTypes.EMAIL:
                    entity[fieldName] = primarySearchField ? `new entity ${entity.id}` : '';
                    break;
                case EntityFieldInputTypes.NUMBER: //TODO for legacy compatibility, remove after upgrade
                case EntityFieldInputTypes.INTEGER:
                case EntityFieldInputTypes.DECIMAL:
                    entity[fieldName] = 0;
                    break;
                case EntityFieldInputTypes.CHECKBOX:
                    entity[fieldName] = false;
                    break;
                case EntityFieldInputTypes.DATE:
                case EntityFieldInputTypes.TIME:
                case EntityFieldInputTypes.DATETIME:
                    entity[fieldName] = null;
                    break;
                case EntityFieldInputTypes.SELECT:
                    entity[fieldName] = Object.values(fieldEnumValues)[0];
                    break;
                case EntityFieldInputTypes.SINGLE_SELECT:
                    entity[fieldName] = null;
                    break;
                case EntityFieldInputTypes.MULTIPLE_SELECT:
                    entity[fieldName] = [];
                    break;
                default:
                    throw new Error(`Not supported field data type: ${fieldDataType}`);
            }
        });
        return entity;
    }

    public getNextId(entityName: string): number {
        const currentId = EntityFactory._entityIdSequences.get(entityName);
        const nextId = (currentId ?? -1) - 1;

        EntityFactory._entityIdSequences.set(entityName, nextId);
        return nextId;
    }

    public resetIdSequence(entityName: string): void {
        EntityFactory._entityIdSequences.set(entityName, 0);
    }
}

export const entityFactory = new EntityFactory();
