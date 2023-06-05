import {IEntityActionRequest, IFieldsDeleteRequest, IEntity} from "../../../../BackendTypes";

export class DeleteEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    private readonly _fieldsDeleteRequestDto: IFieldsDeleteRequest | null = null;

    constructor(entity: IEntity) {
        this.id = entity.id;
    }

    public get fieldsDeleteRequestDto(): IFieldsDeleteRequest | null {
        return this._fieldsDeleteRequestDto;
    }
}
