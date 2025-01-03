import { IEntity, IEntityActionRequest, IFieldsDeleteRequest } from '../../../../BackendTypes';

export class UpdateEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    public readonly fieldsDeleteRequest: IFieldsDeleteRequest | null = null;

    constructor(entity: IEntity, modifiedFieldNames: string[] = []) {
        const fieldNamesToDelete = modifiedFieldNames.filter(fieldName => entity[fieldName] === null);
        if (fieldNamesToDelete.length > 0) {
            this.fieldsDeleteRequest = {
                entityId: entity.id,
                fieldNames: fieldNamesToDelete,
            };
        }

        const remainingFieldNames = modifiedFieldNames.filter(fieldName => !fieldNamesToDelete.includes(fieldName));
        remainingFieldNames.forEach(fieldName => {
            this[fieldName] = entity[fieldName];
        });

        if (entity.id > 0) {
            this.id = entity.id;
        }
    }
}
