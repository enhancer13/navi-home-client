import IBackendEntityDefinition from "../../../BackendTypes/EntityEditor/IEntityDefinition";
import {IStorageItem} from "../DataStorage";

export interface IEntityDefinition extends IBackendEntityDefinition, IStorageItem {
    getJwtControllerUrl(): string;

    getPrimarySearchFieldName(): string;

    getPrimarySortFieldName(): string;
}
