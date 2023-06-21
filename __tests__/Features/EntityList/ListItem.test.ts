import {IEntity, IUser, UserRoles} from "../../../src/BackendTypes";
import {ListItem} from "../../../src/Features/EntityList/ListItem";
import {anything, instance, mock, when} from "ts-mockito";
import {IEntityDefinition, IEntityFactory} from "../../../src/Framework/Data/DataManager";

describe("ListItem", () => {
    let entityDefinitionMock: IEntityDefinition ;
    let entityFactoryMock: IEntityFactory;

    beforeEach(() => {
        entityDefinitionMock = mock<IEntityDefinition>();
        entityFactoryMock = mock<IEntityFactory>();
    });

    it("should initially have no changes", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("should detect changes after updating a field", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("username", "user1_updated");

        // Assert
        expect(listItem.isModified()).toEqual(true);
    });

    it("should not detect changes after updating a field with the same value", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("username", "user1");

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("should return updated value after calling setFieldValue", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("username", "user1_updated");

        // Assert
        expect(listItem.getFieldValue("username")).toEqual("user1_updated");
    });

    it("should return updated field names when calling getModifiedFieldNames", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));
        listItem.setFieldValue("username", "user1_updated");
        listItem.setFieldValue("password", "password1_updated");

        // Act
        const modifiedFieldNames = listItem.getModifiedFieldNames();

        // Assert
        expect(modifiedFieldNames).toEqual(["username", "password"]);
    });

    it("should return updated entity after calling getEntity on updated list item", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));
        listItem.setFieldValue("username", "user1_updated");

        // Act
        const updatedUser = listItem.getEntity() as IUser;

        // Assert
        expect(updatedUser.username).toEqual("user1_updated");
    });

    it("should not have changes after calling undoPendingChanges", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));
        listItem.setFieldValue("username", "user1_updated");

        // Act
        listItem.undoPendingChanges();

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("should revert changes after calling undoPendingChanges", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));
        listItem.setFieldValue("username", "user1_updated");

        // Act
        listItem.undoPendingChanges();

        // Assert
        expect(listItem.getFieldValue("username")).toEqual("user1");
    });

    it("should return unchanged entity after calling undoPendingChanges", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));
        listItem.setFieldValue("username", "user1_updated");

        // Act
        listItem.undoPendingChanges();
        const currentUser = listItem.getEntity() as IUser;

        // Assert
        expect(currentUser.username).toEqual("user1");
    });

    it("new list item should return true when calling isNew", () => {
        // Arrange
        const entityFactoryMock = mock<IEntityFactory>();
        when(entityFactoryMock.create(anything())).thenReturn({id: -1});

        // Act
        const listItem = ListItem.create(instance(entityDefinitionMock), instance(entityFactoryMock));

        // Assert
        expect(listItem.isNew()).toEqual(true);
    });

    it("new list item should return false when calling isModified", () => {
        // Arrange
        const entityFactoryMock = mock<IEntityFactory>();
        when(entityFactoryMock.create(anything())).thenReturn({id: -1});

        // Act
        const listItem = ListItem.create(instance(entityDefinitionMock), instance(entityFactoryMock));

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("new list item should return false when calling isFieldModified and initial value was changed", () => {
        // Arrange
        const entityFactoryMock = mock<IEntityFactory>();
        when(entityFactoryMock.create(anything())).thenReturn({id: -1, name: "value"});

        // Act
        const listItem = ListItem.create(instance(entityDefinitionMock), instance(entityFactoryMock));
        listItem.setFieldValue("name", "updated value")

        // Assert
        expect(listItem.isFieldModified("name")).toEqual(false);
    });

    it("should create a copy of the EntityListItem with updated id and searchFieldName", () => {
        // Arrange
        const searchFieldName = "name";
        const originalEntity: IEntity = { id: 1, [searchFieldName]: "original entity" };
        const entityDefinitionMock = mock<IEntityDefinition>();
        when(entityDefinitionMock.objectName).thenReturn("entity");
        when(entityDefinitionMock.getPrimarySearchFieldName()).thenReturn(searchFieldName);

        const entityFactoryMock = mock<IEntityFactory>();
        when(entityFactoryMock.getNextId(anything())).thenReturn(2);

        const originalEntityListItem = new ListItem(instance(entityDefinitionMock), originalEntity, instance(entityFactoryMock));

        // Act
        const copiedEntityListItem = originalEntityListItem.copy();

        // Assert
        expect(copiedEntityListItem).not.toBe(originalEntityListItem);
        expect(copiedEntityListItem.getEntity()).not.toBe(originalEntity);
        expect(copiedEntityListItem.getId()).toEqual("2");
        expect(copiedEntityListItem.getFieldValue(searchFieldName)).toEqual(`copy of "${originalEntity[searchFieldName]}"`);
    });

    it("should detect changes after changing collection", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [
                {
                    id: 1,
                    userRole: UserRoles.ADMIN
                }
            ],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("userRoles", {
            id: 2,
            userRole: UserRoles.ADMIN
        });

        // Assert
        expect(listItem.isModified()).toEqual(true);
    });

    it("should not detect changes after changing entity fields inside collection", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [
                {
                    id: 1,
                    userRole: UserRoles.ADMIN
                }
            ],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("userRoles", [{
            id: 1,
            userRole: UserRoles.USER
        }]);

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("should not detect changes after changing collection elements order", () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: "user1",
            password: "password1",
            email: "user1@example.com",
            admin: false,
            userRoles: [
                {
                    id: 1,
                    userRole: UserRoles.ADMIN
                },
                {
                    id: 2,
                    userRole: UserRoles.USER
                }
            ],
        };
        const listItem = new ListItem(instance(entityDefinitionMock), user, instance(entityFactoryMock));

        // Act
        listItem.setFieldValue("userRoles", [
            {
                id: 2,
                userRole: UserRoles.USER
            },
            {
                id: 1,
                userRole: UserRoles.ADMIN
            }
        ]);

        // Assert
        expect(listItem.isModified()).toEqual(false);
    });

    it("should update fields with modified values from another list item", () => {
        // Arrange
        const originalEntity = { id: 1, name: "Entity 1", value: 10 };
        const modifiedEntity = { ...originalEntity };
        const listItem1 = new ListItem(instance(entityDefinitionMock), originalEntity, instance(entityFactoryMock));
        const listItem2 = new ListItem(instance(entityDefinitionMock), modifiedEntity, instance(entityFactoryMock));
        listItem2.setFieldValue("value", 20);

        // Act
        listItem1.updateWith(listItem2);

        // Assert
        expect(listItem1.getFieldValue("value")).toEqual(20);
        expect(listItem1.isModified()).toEqual(true);
    });

    it("should return true when entities have the same id", () => {
        // Arrange
        const entity1 = { id: 1, name: "Entity 1", value: 10 };
        const entity2 = { id: 1, name: "Entity 2", value: 20 };
        const listItem1 = new ListItem(instance(entityDefinitionMock), entity1, instance(entityFactoryMock));
        const listItem2 = new ListItem(instance(entityDefinitionMock), entity2, instance(entityFactoryMock));

        // Act
        const result = listItem1.equals(listItem2);

        // Assert
        expect(result).toEqual(true);
    });

    it("should return a new list item with the same values when calling clone", () => {
        // Arrange
        const entity = { id: 1, name: "Entity 1", value: 10 };
        const listItem1 = new ListItem(instance(entityDefinitionMock), entity, instance(entityFactoryMock));

        // Act
        const listItem2 = listItem1.clone();

        // Assert
        expect(listItem1).not.toBe(listItem2);
        expect(listItem1.getEntity()).toEqual(listItem2.getEntity());
    });
});
