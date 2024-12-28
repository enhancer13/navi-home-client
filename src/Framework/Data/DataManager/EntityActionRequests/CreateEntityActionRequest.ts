import {IEntity, IEntityActionRequest} from '../../../../BackendTypes';
import IEntityDefinition from '../../../../BackendTypes/EntityEditor/IEntityDefinition';

export class CreateEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    constructor(entity: IEntity, entityDefinition: IEntityDefinition) {
        entityDefinition.objectFields.forEach(objectField => {
            this[objectField.fieldName] = entity[objectField.fieldName];
        });

        delete this.id;
    }
}
