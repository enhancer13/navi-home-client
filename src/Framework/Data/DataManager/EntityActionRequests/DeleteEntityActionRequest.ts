import {IEntityActionRequest, IEntity} from '../../../../BackendTypes';

export class DeleteEntityActionRequest implements IEntityActionRequest {
    [key: string]: unknown;

    constructor(entity: IEntity) {
        this.id = entity.id;
    }
}
