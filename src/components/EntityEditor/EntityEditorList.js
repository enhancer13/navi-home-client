import React, { Component } from 'react';
import Pagination from '../../helpers/Pagination';
import { Animated, StyleSheet, View } from 'react-native';
import SelectableArea from './SelectableArea';
import entityEditorData from './EntityEditorData';
import PropTypes from 'prop-types';
import { isTablet } from 'react-native-device-info';
import AjaxRequest from '../../helpers/AjaxRequest';
import { FAB } from 'react-native-elements';
import { GlobalStyles } from '../../globals/GlobalStyles';
import EntityEditor from './EntityEditor';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScaleAnimation, SlideAnimation } from '../../animations';
import Entity from './Entity';
import { showSuccess, showError } from '../ApplicationMessaging/Popups';
import { ConfirmationDialog } from './Dialog';
import messaging from '@react-native-firebase/messaging';

export default class EntityEditorList extends Component {
  constructor(props) {
    super(props);
    this.entityEditorData = entityEditorData;
    this.entityData = {
      databaseMethods: {
        create: false,
        update: false,
        get: false,
        delete: false,
      },
    };
    this.state = {
      editorDetails: {
        totalEntities: 0,
      },
      dialog: {
        message: '',
        isActive: false,
        onConfirm: () => {},
      },
      editorActive: false,
      currentEntity: null,
      entities: [],
      loading: true,
      activeSearchValue: '',
    };
    this.slideAnimation = new SlideAnimation(new Animated.Value(hp(100)));
    this.scaleAnimation = new ScaleAnimation();
  }

  openEditor = (entity) => {
    this.setState({
      editorActive: true,
      currentEntity: entity,
    });
    Animated.parallel([
      this.scaleAnimation.getAnimation(1, 400),
      this.slideAnimation.getAnimation(0, 400),
    ]).start();
  };

  closeEditor = (entity) => {
    Animated.parallel([
      this.scaleAnimation.getAnimation(0, 400),
      this.slideAnimation.getAnimation(hp(100), 400),
    ]).start(() => {
      this.setState((prevState) => {
        const entities = [...prevState.entities];
        const index = entities.findIndex((item) => entity.equals(item));
        if (index !== -1) {
          entities[index] = entity;
        }
        return {
          editorActive: false,
          currentEntity: null,
          entities,
        };
      });
    });
  };

  showDialog = (message, onConfirm) => {
    this.setState({
      dialog: {
        isActive: true,
        message: message,
        onConfirm: () => {
          this.closeDialog();
          onConfirm();
        },
        onCancel: this.closeDialog,
      },
    });
  };

  closeDialog = () => {
    this.setState((prevState) => ({
      dialog: {
        ...prevState.dialog,
        isActive: false,
      },
    }));
  };

  processServerResponse = async (response, currentPage) => {
    //do not override the new entities
    const currentEntities = [...this.state.entities];
    const newEntities = currentEntities.filter((entity) => entity.isNew());
    const modifiedEntities = currentEntities.filter((entity) =>
      entity.isModified()
    );

    const loadedEntities = response.data
      .map((item) => new Entity(item))
      .concat(newEntities);
    if (currentPage === 1 && modifiedEntities.length > 0) {
      modifiedEntities.forEach((modifiedEntity) => {
        const entity = loadedEntities.find((e) => e.equals(modifiedEntity));
        if (entity) {
          entity.updateWith(modifiedEntity);
          return;
        }
        loadedEntities.push(modifiedEntity);
      });
    }

    const entities =
      currentPage === 1
        ? loadedEntities
        : currentEntities.concat(loadedEntities);
    this.sortEntities(entities);
    this.setState({
      entities,
      loading: false,
      editorDetails: {
        totalEntities: response.total_elements,
      },
    });
  };

  onCreate = () => {
    const entity = Entity.Create(this.entityData);
    this.setState((prevState) => {
      const entities = [...prevState.entities];
      entities.push(entity);
      return {
        entities,
      };
    });
  };

  onCopy = (selectedEntities) => {
    const copiedEntities = selectedEntities.map((entity) =>
      Entity.Copy(entity, this.entityData)
    );
    this.setState((prevState) => {
      const entities = [...prevState.entities].concat(copiedEntities);
      return {
        entities,
        currentEntity: this.state.editorActive ? copiedEntities[0] : null,
      };
    });
  };

  onRevert = (selectedEntities) => {
    this.setState((prevState) => {
      let entities = [...prevState.entities];
      entities
        .filter((entity) => selectedEntities.some((e) => e.equals(entity)))
        .forEach((entity) => entity.revertChanges());
      entities = entities.filter(
        (entity) =>
          !(entity.isNew() && selectedEntities.some((e) => e.equals(entity)))
      );
      return {
        entities,
      };
    });
  };

  onSave = async (selectedEntities) => {
    const { databaseMethods, controllerUrl } = this.entityData;
    try {
      const newEntities = selectedEntities.filter((entity) => entity.isNew());
      let requestItems = newEntities.map((entity) => entity.getRequestItem());
      if (databaseMethods.create && requestItems.length > 0) {
        const response = await AjaxRequest.post(
          controllerUrl,
          JSON.stringify(requestItems)
        );
        this.removeEntitiesFromState(newEntities);
        this.addEntitiesToState(response.data.map((item) => new Entity(item)));
        showSuccess(`Successfully created ${newEntities.length} item(s).`);
      }

      const modifiedEntities = selectedEntities.filter((entity) =>
        entity.isModified()
      );
      requestItems = modifiedEntities.map((entity) => entity.getRequestItem());
      if (databaseMethods.update && requestItems.length > 0) {
        const response = await AjaxRequest.put(
          controllerUrl,
          JSON.stringify(requestItems)
        );
        this.removeEntitiesFromState(modifiedEntities);
        this.addEntitiesToState(response.data.map((item) => new Entity(item)));
        showSuccess(`Successfully updated ${modifiedEntities.length} item(s).`);
      }
    } catch (ex) {
      showError(`Unable to save or update item(s). ${ex.message}`);
    }
  };

  onDeleteRequest = (selectedEntities) => {
    const { sortFieldName } = this.paginationDetails;
    const entityNames = selectedEntities
      .map((entity) => entity.getFieldValue(sortFieldName))
      .join(', ');
    const message = `Do you want to delete ${entityNames}? You cannot undo this action.`;
    this.showDialog(message, () => this.onDelete(selectedEntities));
  };

  onDelete = async (selectedEntities) => {
    //not persisted in DB, so just remove from the state
    const newEntities = selectedEntities.filter((entity) => entity.isNew());
    this.removeEntitiesFromState(newEntities);

    const { databaseMethods, controllerUrl } = this.entityData;
    const entitiesToDelete = selectedEntities.filter(
      (entity) => !entity.isNew()
    );
    const requestItems = entitiesToDelete.map((entity) =>
      entity.getRequestItem()
    );
    try {
      if (databaseMethods.delete && requestItems.length > 0) {
        await AjaxRequest.delete(controllerUrl, JSON.stringify(requestItems));
        this.removeEntitiesFromState(entitiesToDelete);
        showSuccess(`Successfully deleted ${entitiesToDelete.length} item(s).`);
      }
    } catch (ex) {
      showError(`Unable to delete item(s). ${ex.message}`);
    }
  };

  onEntityPress = (entity) => {
    const { onEntityPress } = this.props;
    if (onEntityPress) {
      onEntityPress(
        entity.getItem(),
        this.state.entities.map((e) => e.getItem())
      );
    } else {
      this.openEditor(entity);
    }
  };

  removeEntitiesFromState = (entitiesToDelete) => {
    this.setState((prevState) => {
      const entities = [...prevState.entities].filter(
        (entity) => !entitiesToDelete.some((e) => e.equals(entity))
      );
      return {
        entities,
        currentEntity: null,
      };
    });
  };

  addEntitiesToState = (newEntities) => {
    this.setState((prevState) => {
      const entities = [...prevState.entities].concat(newEntities);
      this.sortEntities(entities);
      return {
        entities,
        currentEntity: this.state.editorActive ? newEntities[0] : null,
      };
    });
  };

  sortEntities = (entities) => {
    //for now descending by default TODO
    const { sortFieldName } = this.paginationDetails;
    entities
      .sort((a, b) =>
        a
          .getFieldValue(sortFieldName)
          .localeCompare(b.getFieldValue(sortFieldName))
      )
      .reverse();
  };

  onSearch = (searchValue) => {
    this.pagination
      .fetchPage(this.processServerResponse, searchValue)
      .then(() => {
        this.setState({
          activeSearchValue: searchValue,
        });
      });
  };

  onRefresh = async () => {
    await this.pagination.fetchPage(
      this.processServerResponse,
      this.state.activeSearchValue
    );
  };

  initFirebaseListener() {
    this.firebaseMessageListener = messaging().onMessage(
      async (remoteMessage) => {
        const { entityName } = this.props;
        if (remoteMessage.data.entityEditor) {
          const entityEditorEvent = JSON.parse(remoteMessage.data.entityEditor);
          if (entityEditorEvent.entityName !== entityName.toLowerCase()) {
            return;
          }
          await this.onRefresh();
        }
      }
    );
  }

  async componentDidMount() {
    await this.entityEditorData.Initialize();
    const { entityName, parentEntityName, parentEntity } = this.props;
    this.paginationDetails =
      this.entityEditorData.GetPaginationData(entityName);

    if (parentEntityName) {
      const parentPrimarySearchField =
        this.entityEditorData.GetPrimarySearchField(parentEntityName);
      this.paginationDetails.extraSearchCondition = `&${parentPrimarySearchField}=${parentEntity[parentPrimarySearchField]}`;
    }
    this.entityData = this.entityEditorData.GetEntityData(entityName);
    this.pagination = new Pagination(this.paginationDetails);
    await this.pagination.fetchPage(this.processServerResponse);
    this.initFirebaseListener();
  }

  componentWillUnmount() {
    this.firebaseMessageListener && this.firebaseMessageListener();
  }

  render() {
    const {
      editorDetails,
      loading,
      entities,
      activeSearchValue,
      editorActive,
      currentEntity,
      dialog,
    } = this.state;
    const {
      ItemComponent,
      navigation,
      numColumns = isTablet() ? 2 : 1,
      title,
      backButton = true,
      enableSearch = true,
    } = this.props;
    return (
      <View style={styles.container}>
        {editorActive && (
          <Animated.View
            style={[
              styles.entityEditorContainer,
              this.slideAnimation.getStyle(),
            ]}
          >
            <EntityEditor
              title={title + ' Editor'}
              entity={currentEntity}
              entityData={this.entityData}
              entityEditorData={this.entityEditorData}
              onSave={this.onSave}
              onCopy={this.onCopy}
              onDelete={this.onDeleteRequest}
              onClose={this.closeEditor}
            />
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.selectableAreaContainer,
            this.scaleAnimation.getStyle(1, 0),
          ]}
        >
          <SelectableArea
            navigation={navigation}
            ItemComponent={ItemComponent}
            entityData={this.entityData}
            entities={entities}
            title={title}
            subTitle={`Number of items: ${editorDetails.totalEntities}`}
            loading={loading}
            backButton={backButton}
            enableSearch={enableSearch}
            numColumns={numColumns}
            onEntityPress={(entity) => this.onEntityPress(entity, entities)}
            onSave={this.onSave}
            onCopy={this.onCopy}
            onDelete={this.onDeleteRequest}
            onRevert={this.onRevert}
            onSearch={this.onSearch}
            onSearchClear={this.onSearch}
            onRefresh={this.onRefresh}
            onEndReached={() =>
              this.pagination.fetchNextPage(
                this.processServerResponse,
                activeSearchValue
              )
            }
          />
          {this.entityData.databaseMethods.create && (
            <FAB
              onPress={this.onCreate}
              title="Create"
              placement="right"
              loading={loading}
              color={GlobalStyles.lightVioletColor}
            />
          )}
          <ConfirmationDialog
            message={dialog.message}
            visible={dialog.isActive}
            onConfirm={dialog.onConfirm}
            onCancel={this.closeDialog}
          />
        </Animated.View>
      </View>
    );
  }
}

EntityEditorList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  ItemComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  numColumns: PropTypes.number,
  onEntityPress: PropTypes.func,
  backButton: PropTypes.bool,
  enableSearch: PropTypes.bool,
  parentEntityName: PropTypes.string,
  parentEntity: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entityEditorContainer: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  selectableAreaContainer: {
    flex: 1,
    zIndex: 0,
  },
});
