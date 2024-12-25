// noinspection DuplicatedCode

import { renderHook } from '@testing-library/react';
import { mock, instance, when } from 'ts-mockito';
import {IEntityDefinition} from "../../../../src/Framework/Data/DataManager";
import {ListItem} from "../../../../src/Features/EntityList/ListItem";
import {useActionsStatus} from "../../../../src/Features/EntityList/Hooks/useActionsStatus";

describe('useActionsStatus', () => {
    let entityDefinitionMock: IEntityDefinition;
    let listItemMock: ListItem;

    beforeEach(() => {
        entityDefinitionMock = mock<IEntityDefinition>();
        listItemMock = mock<ListItem>();
    });

    test('should return default actions status when selectedItems and entityDefinition are not provided', () => {
        // Act
        const { result } = renderHook(() =>
            useActionsStatus([],[], undefined)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: false,
            canDeselectAll: false,
        });
    });

    test('should enable selectAll and deselectAll actions when an item is selected', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable update action when database action update is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: true,
            delete: false,
        });
        const listItems: ListItem[] = [];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: true,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: false,
        });
    });

    test('should enable save action when an modified item is selected and database action update is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: true,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(true);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: true,
            canSave: true,
            canSelect: false,
            canDelete: false,
            canRevert: true,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should NOT enable save action when selected item is NOT modified and database action update is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: true,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: true,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable create action when database action create is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: true,
            update: false,
            delete: false,
        });
        const listItems: ListItem[] = [];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: true,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: false,
        });
    });

    test('should NOT enable save action when selected item is NOT modified and database action create is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: true,
            update: false,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: true,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: true,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should NOT enable save action when selected item is modified and database action update is NOT allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: true,
            update: false,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(true);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: true,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: true,
            canCopy: true,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should NOT enable save action when selected item is new and database action create is NOT allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: true,
            delete: false,
        });
        when(listItemMock.isNew()).thenReturn(true);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: true,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable copy action when an item is selected and database action create is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: true,
            update: false,
            delete: false,
        });
        when(listItemMock.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: true,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: true,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable delete action when an item is selected and database action delete is allowed', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: true,
        });
        when(listItemMock.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result} = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition)
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: true,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable revert action when an item is modified', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: false,
        });

        // Act
        when(listItemMock.isModified()).thenReturn(true);
        const listItems = [instance(listItemMock)];
        const entityDefinition = instance(entityDefinitionMock);

        const { result } = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: true,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should enable revert action when all selected items are modified', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: false,
        });

        when(listItemMock.isModified()).thenReturn(true);
        const listItemMock2 = mock<ListItem>();
        when(listItemMock2.isModified()).thenReturn(true);
        const listItems = [instance(listItemMock), instance(listItemMock2)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result } = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: true,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should disable revert action when not all selected items are modified', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: false,
        });

        when(listItemMock.isModified()).thenReturn(true);
        const listItemMock2 = mock<ListItem>();
        when(listItemMock2.isModified()).thenReturn(false);
        const listItems = [instance(listItemMock), instance(listItemMock2)];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result } = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: true,
        });
    });

    test('should disable all actions except selectAll when no items are selected', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: true,
            create: true,
            update: true,
            delete: true,
        });

        const listItems: ListItem[] = [];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result } = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: true,
            canUpdate: true,
            canSave: false,
            canSelect: true,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: false,
        });
    });

    test('should disable all actions when no items are selected and databaseMethods are set to false', () => {
        // Arrange
        when(entityDefinitionMock.databaseMethods).thenReturn({
            get: false,
            create: false,
            update: false,
            delete: false,
        });

        const listItems: ListItem[] = [];
        const entityDefinition = instance(entityDefinitionMock);

        // Act
        const { result } = renderHook(() =>
            useActionsStatus(listItems, listItems, entityDefinition),
        );

        // Assert
        expect(result.current).toEqual({
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canSelect: false,
            canDelete: false,
            canRevert: false,
            canCopy: false,
            canSelectAll: true,
            canDeselectAll: false,
        });
    });
});
