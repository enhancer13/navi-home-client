import {IFieldsDeleteRequest} from "./IFieldsDeleteRequest";

export interface IEntityActionRequest {
    [key: string]: unknown;

    fieldsDeleteRequestDto: IFieldsDeleteRequest | null;
}

