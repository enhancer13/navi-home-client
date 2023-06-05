import {IEntityFieldDefinition} from "./IEntityFieldDefinition";
import {IEntityDatabaseMethods} from "./IEntityDatabaseMethods";
import {ControllerAuthorizations} from "./Enums/ControllerAuthorizations";

export default interface IEntityDefinition {
    objectName: string;
    objectFields: Array<IEntityFieldDefinition>;
    databaseMethods: IEntityDatabaseMethods;
    auditable: string;
    controllerUrls: { [key in ControllerAuthorizations]: string };
    displayOnlyTable: boolean;
}

