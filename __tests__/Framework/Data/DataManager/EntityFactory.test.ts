import {EntityFieldInputTypes, IEntityFieldDefinition} from "../../../../src/BackendTypes";
import {EntityFactory, IEntityDefinition} from "../../../../src/Framework/Data/DataManager";
import {instance, mock, when} from "ts-mockito";

describe('EntityFactory', () => {
    let entityDefinitionMock: IEntityDefinition;
    let entityFactory: EntityFactory;

    beforeEach(() => {
        entityFactory = new EntityFactory();
        entityFactory.resetIdSequence('TestEntity');
        entityFactory.resetIdSequence('TestEntity1');
        entityFactory.resetIdSequence('TestEntity2');

        entityDefinitionMock = mock<IEntityDefinition>();
        when(entityDefinitionMock.objectName).thenReturn('TestEntity');

        const idFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(idFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.TEXT);
        when(idFieldDefinitionMock.primarySearchField).thenReturn(false);
        when(idFieldDefinitionMock.fieldName).thenReturn('id');

        const nameFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(nameFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.TEXT);
        when(idFieldDefinitionMock.primarySearchField).thenReturn(true);
        when(nameFieldDefinitionMock.fieldName).thenReturn('name');

        const ageFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(ageFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.INTEGER);
        when(ageFieldDefinitionMock.fieldName).thenReturn('age');

        const activeFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(activeFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.CHECKBOX);
        when(activeFieldDefinitionMock.fieldName).thenReturn('active');

        const birthDateFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(birthDateFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.DATE);
        when(birthDateFieldDefinitionMock.fieldName).thenReturn('birthDate');

        const genderFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(genderFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.SELECT);
        when(genderFieldDefinitionMock.fieldName).thenReturn('gender');
        when(genderFieldDefinitionMock.fieldEnumValues).thenReturn({male: 'male', female: 'female'});

        const categoryFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(categoryFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.SINGLE_SELECT);
        when(categoryFieldDefinitionMock.fieldName).thenReturn('category');
        when(categoryFieldDefinitionMock.fieldEnumValues).thenReturn(new Map([['A', 'A'], ['B', 'B']]));

        const tagsFieldDefinitionMock = mock<IEntityFieldDefinition>();
        when(tagsFieldDefinitionMock.fieldDataType).thenReturn(EntityFieldInputTypes.MULTIPLE_SELECT);
        when(tagsFieldDefinitionMock.fieldName).thenReturn('tags');
        when(tagsFieldDefinitionMock.fieldEnumValues).thenReturn(new Map([['tag1', 'tag1'], ['tag2', 'tag2']]));

        when(entityDefinitionMock.objectFields).thenReturn( [
            instance(idFieldDefinitionMock),
            instance(nameFieldDefinitionMock),
            instance(ageFieldDefinitionMock),
            instance(activeFieldDefinitionMock),
            instance(birthDateFieldDefinitionMock),
            instance(genderFieldDefinitionMock),
            instance(categoryFieldDefinitionMock),
            instance(tagsFieldDefinitionMock)
        ]);
    });

    describe('create', () => {
        it('should create a new entity with the provided definition', () => {
            const entity = entityFactory.create(instance(entityDefinitionMock));

            expect(entity).toEqual({
                id: -1,
                name: 'new entity -1',
                age: 0,
                active: false,
                birthDate: null,
                gender: 'male',
                category: null,
                tags: [],
            });
        });
    });

    describe('getNextId', () => {
        it('should generate unique negative IDs for the same entity name', () => {
            const id1 = entityFactory.getNextId('TestEntity');
            const id2 = entityFactory.getNextId('TestEntity');

            expect(id1).toBe(-1);
            expect(id2).toBe(-2);
        });

        it('should generate unique negative IDs for different entity names', () => {
            const id1 = entityFactory.getNextId('TestEntity1');
            const id2 = entityFactory.getNextId('TestEntity2');

            expect(id1).toBe(-1);
            expect(id2).toBe(-1);
        });
    });
});
