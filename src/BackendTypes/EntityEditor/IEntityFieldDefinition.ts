import {EntityFieldInputTypes} from "./Enums/EntityFieldInputTypes";
import {EntityFieldSearchPolicies} from "./Enums/EntityFieldSearchPolicies";
import {IEntityFieldValidator} from "./IEntityFieldValidator";
import {ControllerAuthorizations} from "./Enums/ControllerAuthorizations";

export interface IEntityFieldDefinition {
    primarySearchField: boolean;
    inputDisabled: boolean;
    sortDisabled: boolean;
    searchDisabled: boolean;
    fieldName: string;
    fieldTitle: string;
    fieldDataType: EntityFieldInputTypes;
    fieldEnumValues: {[key: string]: string}; //only for enums, when fieldDataType == SELECT
    fieldValidator: IEntityFieldValidator;
    searchPolicy: EntityFieldSearchPolicies;
    rowGroup: number;
    fieldOrder: number;
    controllerUrls: Map<ControllerAuthorizations, string>;
    searchFieldName: string;
    objectName: string;
    initialTableSort: string;
    tableColumnWidth: string;
}
