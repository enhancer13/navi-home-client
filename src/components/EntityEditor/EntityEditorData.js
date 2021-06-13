import AjaxRequest from '../../helpers/AjaxRequest';
import Globals from '../../globals/Globals';

// noinspection JSUnresolvedVariable
class EntityEditorData {
  #entitiesMap;

  async Initialize() {
    if (!this.#entitiesMap) {
      const response = await AjaxRequest.get(Globals.Endpoints.ENTITY_EDITOR_DATA);
      this.#entitiesMap = new Map(response.map((item) => [item.objectName, item]));
    }
  }

  GetPaginationData(entityName) {
    const entityData = this.GetEntityData(entityName);
    const searchFieldName = this.GetPrimarySearchField(entityName);
    return {baseUrl: entityData.controllerUrl, sortFieldName: searchFieldName, searchFieldName: searchFieldName};
  }

  GetPrimarySearchField(entityName) {
    return this.GetEntityData(entityName).objectFields.find((field) => field.primarySearchField).fieldName;
  }

  GetEntityData(entityName) {
    return this.#entitiesMap.get(entityName);
  }
}

const entityEditorData = new EntityEditorData();

export default entityEditorData;
