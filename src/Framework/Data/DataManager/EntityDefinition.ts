import {IEntityFieldDefinition, ControllerAuthorizations, IEntityDatabaseMethods} from "../../../BackendTypes";
import {StorageItem} from "../LocalStorage";
import {IEntityDefinition} from "./IEntityDefinition";

export class EntityDefinition implements IEntityDefinition, StorageItem {
    key: string;
    private readonly _objectName: string;
    private readonly _objectFields: Array<IEntityFieldDefinition>;
    private readonly _controllerUrls: { [key in ControllerAuthorizations]: string };
    private readonly _databaseMethods: IEntityDatabaseMethods;
    private readonly _auditable: string;
    private readonly _displayOnlyTable: boolean;

    constructor(objectName: string, objectFields: Array<IEntityFieldDefinition>, controllerUrls: { [key in ControllerAuthorizations]: string }, databaseMethods: IEntityDatabaseMethods, auditable: string, displayOnlyTable: boolean) {
        this.key = objectName;
        this._objectName = objectName;
        this._objectFields = objectFields;
        this._controllerUrls = controllerUrls;
        this._databaseMethods = databaseMethods;
        this._auditable = auditable;
        this._displayOnlyTable = displayOnlyTable;
    }

    get objectName(): string {
        return this._objectName;
    }

    get objectFields(): Array<IEntityFieldDefinition> {
        return this._objectFields;
    }

    get displayOnlyTable(): boolean {
        return this._displayOnlyTable;
    }

    get databaseMethods(): IEntityDatabaseMethods {
        return this._databaseMethods;
    }

    get controllerUrls(): { [key in ControllerAuthorizations]: string } {
        return this._controllerUrls;
    }

    get auditable(): string {
        return this._auditable;
    }

    getJwtControllerUrl(): string {
        return this._controllerUrls[ControllerAuthorizations.JWT];
    }

    getPrimarySearchFieldName(): string {
        const primarySearchField = this._objectFields.find(x => x.primarySearchField);
        if (!primarySearchField) {
            throw new Error(`Unable to find primary search field for ${this._objectName}`);
        }

        return primarySearchField.fieldName;
    }

    getPrimarySortFieldName(): string {
        return this.getPrimarySearchFieldName();
    }
}
