import {IUser} from '../../../src/BackendTypes';
import {ListItemField} from '../../../src/Features/EntityList/ListItemField';

describe('EditorField', () => {
    // GIVEN an ItemField with a collection of IEntity (IUser)
    // WHEN comparing the collection with the same collection (same IDs and order)
    // EXPECT isModified() to return false
    it('should return false when comparing the same IEntity collection with the same order', () => {
        // Arrange
        const users: IUser[] = [
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const editorField = new ListItemField('users', users);

        // Act
        editorField.setValue(users);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN two empty collections as original and current values
    // WHEN checking if the values are modified
    // THEN the result to be false (not modified)
    test('should return false when comparing two empty collections', () => {
        // Arrange
        const emptyArray1: unknown[] = [];
        const emptyArray2: unknown[] = [];
        const editorField = new ListItemField('user', emptyArray1);

        // Act
        editorField.setValue(emptyArray2);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of IEntity (IUser)
    //   AND the value is updated with empty collection
    // WHEN checking if the values are modified
    // THEN the result to be true (modified)
    test('should return true when non empty IEntity collection updated with empty collection', () => {
        // Arrange
        const users: IUser[] = [
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const editorField = new ListItemField('users', users);

        // Act
        editorField.setValue([]);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with a collection of IEntity (IUser)
    //  AND the value updated with a different collection (different IDs)
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return true when comparing different IEntity collections', () => {
        // Arrange
        const users: IUser[] = [
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const updatedUsers: IUser[] = [
            {
                id: 3,
                username: 'user3',
                password: 'password3',
                email: 'user3@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 4,
                username: 'user4',
                password: 'password4',
                email: 'user4@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const editorField = new ListItemField('users', users);

        // Act
        editorField.setValue(updatedUsers);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with a collection of IEntity (IUser)
    //  AND the value updated with the same collection but in a different order
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return false when comparing the same IEntity collection with a different order', () => {
        // Arrange
        const users: IUser[] = [
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const usersDifferentOrder: IUser[] = [
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
        ];

        const editorField = new ListItemField('users', users);

        // Act
        editorField.setValue(usersDifferentOrder);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of IEntity (IUser)
    //  AND the value updated with the same collection (same IDs and order)
    //  AND collection elements are modified except IDs
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return true when comparing the same IEntity collection with a different order but collection elements are modified except IDs', () => {
        // Arrange
        const users: IUser[] = [
            {
                id: 1,
                username: 'user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
            {
                id: 2,
                username: 'user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
        ];

        const usersDifferentOrder: IUser[] = [
            {
                id: 2,
                username: 'changed user2',
                password: 'password2',
                email: 'user2@example.com',
                admin: true,
                userRoles: [],
            },
            {
                id: 1,
                username: 'changed user1',
                password: 'password1',
                email: 'user1@example.com',
                admin: false,
                userRoles: [],
            },
        ];

        const editorField = new ListItemField('users', users);

        // Act
        editorField.setValue(usersDifferentOrder);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of numbers
    //  AND the value updated with the same collection
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return false when comparing the same collection of numbers', () => {
        // Arrange
        const numbers: number[] = [
            1, 2, 3, 4, 5,
        ];

        const editorField = new ListItemField('numbers', numbers);

        // Act
        editorField.setValue(numbers);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of numbers
    //  AND the value with another collection (the same numbers)
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return false when comparing the collection of numbers with another collection but with the same numbers', () => {
        // Arrange
        const numbers: number[] = [
            1, 2, 3, 4, 5,
        ];
        const editorField = new ListItemField('numbers', numbers);

        // Act
        const newNumbers = [1, 2, 3, 4, 5];
        editorField.setValue(newNumbers);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of numbers
    //  AND the value updated with another collection the same numbers but in a different order
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return false when comparing the collection of numbers with another collection but with the same numbers but in different order', () => {
        // Arrange
        const numbers: number[] = [
            1, 2, 3, 4, 5,
        ];
        const editorField = new ListItemField('numbers', numbers);

        // Act
        const newNumbers = [5, 2, 1, 4, 3];
        editorField.setValue(newNumbers);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with a collection of numbers
    //  AND the value updated with another collection with different numbers
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return false when comparing the collection of numbers with another collection but with the different numbers', () => {
        // Arrange
        const numbers: number[] = [
            1, 2, 3, 4, 5,
        ];
        const editorField = new ListItemField('numbers', numbers);

        // Act
        const newNumbers = [5, 6, 1, 4, 3];
        editorField.setValue(newNumbers);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with a collection of numbers
    //  AND the value updated with null
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return true when comparing the collection of numbers with null', () => {
        // Arrange
        const numbers: number[] = [
            1, 2, 3, 4, 5,
        ];
        const editorField = new ListItemField('numbers', numbers);

        // Act
        editorField.setValue(null);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with IUser
    //  AND the value updated with another IUser (another ID)
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return true when comparing the entity with another entity different ID', () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        const editorField = new ListItemField('user', user);

        // Act
        const updatedUser: IUser = {
            id: 2,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        editorField.setValue(updatedUser);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with IUser
    //  AND the value updated with another IUser (same ID)
    //  AND another values are different
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return false when comparing the entity with another entity same ID and discrepancies in another fields', () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        const editorField = new ListItemField('user', user);

        // Act
        const updatedUser: IUser = {
            id: 1,
            username: 'changed user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        editorField.setValue(updatedUser);

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    // GIVEN an ItemField with IUser
    //  AND the value updated with null
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return true when comparing the entity with null', () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        const editorField = new ListItemField('user', user);

        // Act
        editorField.setValue(null);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField with null value
    //  AND the value updated with IUser
    // WHEN checking if the value is modified
    // EXPECT isModified() to return true
    it('should return true when comparing null with entity', () => {
        // Arrange
        const editorField = new ListItemField('user', null);

        // Act
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        editorField.setValue(user);

        // Assert
        expect(editorField.isValueModified()).toEqual(true);
    });

    // GIVEN an ItemField modified state
    //  AND when undoing the changes
    // WHEN checking if the value is modified
    // EXPECT isModified() to return false
    it('should return is modified false when undoing pending changes', () => {
        // Arrange
        const user: IUser = {
            id: 1,
            username: 'user1',
            password: 'password1',
            email: 'user1@example.com',
            admin: false,
            userRoles: [],
        };
        const editorField = new ListItemField('user', user);
        editorField.setValue(null);

        // Act
        editorField.undoPendingChanges();

        // Assert
        expect(editorField.isValueModified()).toEqual(false);
    });

    describe('setValue validation', () => {
        it('should set the value of the field if the types are the same', () => {
            const editorField = new ListItemField('username', 'Alex');
            editorField.setValue('John');

            expect(editorField.currentValue).toEqual('John');
        });

        it('should set the value of the field if the current value is null', () => {
            const editorField = new ListItemField('username', null);
            editorField.setValue('John');

            expect(editorField.currentValue).toEqual('John');
        });

        it('should set the value of the field to null if the new value is null', () => {
            const editorField = new ListItemField('username', 'John');
            editorField.setValue(null);

            expect(editorField.currentValue).toBeNull();
        });

        it('should throw an error if the types are different', () => {
            const editorField = new ListItemField('age', 30);

            expect(() => {
                editorField.setValue('30');
            }).toThrowError('Cannot set value of type string to field age of type number');
        });
    });
});
