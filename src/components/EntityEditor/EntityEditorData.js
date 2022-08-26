import AjaxRequest from '../../helpers/AjaxRequest';
import {applicationConstants} from '../../config/ApplicationConstants';
import {backendEndpoints} from '../../config/BackendEndpoints';

const controllerAuthorization = Object.freeze({
  GENERAL: 'GENERAL',
  JWT: 'JWT',
  BASIC: 'BASIC',
});

// noinspection JSUnresolvedVariable
class EntityEditorData {
  #entitiesMap;

  async Initialize() {
    if (!this.#entitiesMap) {
      const response = await AjaxRequest.get(
        backendEndpoints.ENTITY_EDITOR_DATA
      );
      this.#entitiesMap = new Map(
        response.map((item) => [item.objectName, item])
      );
    }
  }

  GetPaginationData(entityName) {
    const entityData = this.GetEntityData(entityName);
    const searchFieldName = this.GetPrimarySearchField(entityName);
    return {
      baseUrl: entityData.controllerUrl,
      sortFieldName: searchFieldName,
      searchFieldName: searchFieldName,
    };
  }

  GetPrimarySearchField(entityName) {
    return this.GetEntityData(entityName).objectFields.find(
      (field) => field.primarySearchField
    ).fieldName;
  }

  GetEntityData(entityName) {
    const entityData = this.#entitiesMap.get(entityName);
    entityData.controllerUrl =
      entityData.controllerUrls[controllerAuthorization.JWT];
    return entityData;
  }
}

const entityEditorData = new EntityEditorData();

export default entityEditorData;
