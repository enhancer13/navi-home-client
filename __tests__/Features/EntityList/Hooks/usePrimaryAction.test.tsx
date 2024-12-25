// noinspection DuplicatedCode

import {renderHook, act} from '@testing-library/react';
import {ListItem} from "../../../../src/Features/EntityList/ListItem";
import {ActionsStatus} from "../../../../src/Features/EntityList/Components/EntityActionsBar";
import {usePrimaryAction} from "../../../../src/Features/EntityList";
import React from "react";
import SelectableList from "../../../../src/Features/EntityList/Components/SelectableList/SelectableList";
import {instance, mock, when} from "ts-mockito";
import {MD3LightTheme} from "react-native-paper";

jest.mock('../../../../src/Features/EntityList/Components/SelectableList/SelectableList'); // adjust the path to your SelectableList component

describe('usePrimaryAction', () => {
    let actionsStatus: ActionsStatus;
    let listItemMock: ListItem;
    let selectableListRef: React.MutableRefObject<SelectableList<ListItem>>;
    let listItems: ListItem[];
    let doSave: (items?: ListItem[]) => Promise<void>;
    let doCreate: () => void;

    beforeEach(() => {
        actionsStatus = {
            canCreate: false,
            canUpdate: false,
            canSave: false,
            canRevert: false,
            canCopy: false,
            canDelete: false,
            canSelectAll: false,
            canDeselectAll: false,
            canSelect: false
        };
        selectableListRef = {
            current: new SelectableList({
                refreshing: false,
                items: [],
                columnCount: 1,
                onSelectionChanged: jest.fn(),
                onSelectionStarted: jest.fn(),
                onSelectionStopped: jest.fn(),
                onPress: jest.fn(),
                onRefresh: jest.fn(),
                onEndReached: jest.fn(),
                renderItem: jest.fn(),
                keyExtractor: jest.fn(),
                onScroll: jest.fn(),
                theme: MD3LightTheme
            }),
        };

        doSave = jest.fn();
        doCreate = jest.fn();
        listItemMock = mock<ListItem>();
        listItems = [];
        selectableListRef.current.selectAll = jest.fn();
        selectableListRef.current.hasSelectedItems = jest.fn();
    });

    test('should return Save action when listItems are new or modified and actionsStatus allows update or create', () => {
        // Arrange
        actionsStatus.canCreate = true;
        actionsStatus.canUpdate = true;
        when(listItemMock.isModified()).thenReturn(true);
        listItems = [instance(listItemMock)];

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSave, doCreate)
        );

        // Assert
        expect(result.current[0]).toEqual('Save');
    });

    test('should return Create action when actionsStatus allows create', () => {
        // Arrange
        actionsStatus.canCreate = true;
        actionsStatus.canUpdate = false;

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSave, doCreate)
        );

        // Assert
        expect(result.current[0]).toEqual('Create');
    });

    test('should return Select action when actionsStatus does not allow create or update', () => {
        // Arrange
        actionsStatus.canCreate = false;
        actionsStatus.canUpdate = false;

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSave, doCreate)
        );

        // Assert
        expect(result.current[0]).toEqual('Select');
    });

    test('should call doSave when Save action is triggered', async () => {
        // Arrange
        actionsStatus.canCreate = true;
        actionsStatus.canUpdate = true;
        when(listItemMock.isModified()).thenReturn(true);
        listItems = [instance(listItemMock)];

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSave, doCreate)
        );
        const action = result.current[1];
        await act(() => action());

        // Assert
        expect(doSave).toHaveBeenCalledWith(expect.arrayContaining(listItems));
    });

    test('should call doCreate when Create action is triggered', async () => {
        // Arrange
        actionsStatus.canCreate = true;
        actionsStatus.canUpdate = false;
        const doCreateMock = jest.fn();
        const doSaveMock = jest.fn();

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSaveMock, doCreateMock),
        );

        // Trigger the Create action
        const [actionLabel, actionFunction] = result.current;
        act(() => actionFunction());

        // Assert
        expect(doCreateMock).toHaveBeenCalled();
        expect(actionLabel).toBe('Create');
    });

    test('should call selectAll when neither Create nor Update are possible', async () => {
        // Arrange
        actionsStatus.canCreate = false;
        actionsStatus.canUpdate = false;
        selectableListRef.current.selectAll = jest.fn();
        const doCreateMock = jest.fn();
        const doSaveMock = jest.fn();

        // Act
        const {result} = renderHook(() =>
            usePrimaryAction(actionsStatus, selectableListRef, listItems, doSaveMock, doCreateMock),
        );

        // Trigger the Select action
        const [actionLabel, actionFunction] = result.current;
        act(() => actionFunction());

        // Assert
        expect(selectableListRef.current.selectAll).toHaveBeenCalled();
        expect(actionLabel).toBe('Select');
    });
});
