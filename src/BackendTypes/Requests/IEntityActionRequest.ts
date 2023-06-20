import {IFieldsDeleteRequest} from "./IFieldsDeleteRequest";

export interface IEntityActionRequest {
    [key: string]: unknown;

    fieldsDeleteRequest: IFieldsDeleteRequest | null;
}

