import {IEntity, IEntityActionRequest, IFieldsDeleteRequest} from "../../../../BackendTypes";

export class UpdateEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    private readonly _fieldsDeleteRequestDto: IFieldsDeleteRequest | null = null;

    constructor(entity: IEntity, modifiedFieldNames: string[] = []) {
        const fieldNamesToDelete = modifiedFieldNames.filter(fieldName => entity[fieldName] === null);
        if (fieldNamesToDelete.length > 0) {
            this._fieldsDeleteRequestDto = {
                fieldNames: modifiedFieldNames.filter(fieldName => entity[fieldName] === null)
            };
        }

        modifiedFieldNames.filter(fieldName => !fieldNamesToDelete.includes(fieldName))
            .forEach(fieldName => this[fieldName] = entity[fieldName]);

        if (entity.id > 0) {
            this.id = entity.id;
        }
    }

    public get fieldsDeleteRequestDto(): IFieldsDeleteRequest | null {
        return this._fieldsDeleteRequestDto;
    }
}
