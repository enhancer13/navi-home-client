import {IEntity, IEntityActionRequest, IFieldsDeleteRequest} from "../../../../BackendTypes";
import IEntityDefinition from "../../../../BackendTypes/EntityEditor/IEntityDefinition";

export class CreateEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    private readonly _fieldsDeleteRequestDto: IFieldsDeleteRequest | null = null;

    constructor(entity: IEntity, entityDefinition: IEntityDefinition) {
        entityDefinition.objectFields.forEach(objectField => {
            this[objectField.fieldName] = entity[objectField.fieldName];
        })

        delete this.id;
    }

    public get fieldsDeleteRequestDto(): IFieldsDeleteRequest | null {
        return this._fieldsDeleteRequestDto;
    }
}
