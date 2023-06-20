import React, {useEffect, useState, useMemo, useRef} from 'react';
import {DropDownListPicker} from "../DropDownListPicker";
import {useEntityDataManager} from "../../Hooks/EntityDataManager/useEntityDataManager";
import {IPageQuery} from "../../../Framework/Data/DataManager";
import {IEntity} from "../../../BackendTypes";
import {List} from "react-native-paper";
import {ValueType} from "react-native-dropdown-picker";
import {isArray} from "lodash";
import {isEntity, isEntityArray} from "../../../Helpers/EntityUtils";

declare type Props = {
    title: string;
    entityName: string;
    selectedData: IEntity | IEntity[];
    multiple: boolean;
    readonly: boolean;
    onChange: (value: IEntity | IEntity[] | null) => void;
    titleFormatter?: (label: string) => string;
};

export const ListEntityDropDownListPicker: React.FC<Props> = ({
                                                                  title,
                                                                  entityName,
                                                                  selectedData,
                                                                  multiple,
                                                                  readonly,
                                                                  onChange,
                                                                  titleFormatter
                                                              }) => {
    const [entities, setEntities] = useState<IEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const entitiesRef = useRef<IEntity[]>();
    entitiesRef.current = entities;

    const entityDataManager = useEntityDataManager(entityName);
    const entityDefinition = entityDataManager?.entityDefinition;

    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            setLoading(true);
            const pageQuery: IPageQuery = {
                page: 1,
                size: 100,
            };
            try {
                const page = await entityDataManager?.get(pageQuery);
                if (page && !isCancelled && isEntityArray(page.data)) {
                    setEntities(page.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData().catch(err => console.error(err.message));

        return () => {
            isCancelled = true;
        };
    }, [entityDataManager]);

    const onSelectedDataChanged = (selectedData: null | ValueType | ValueType[]) => {
        if (!entitiesRef.current || entitiesRef.current.length === 0) {
            return;
        }

        if (selectedData === null) {
            onChange(null);
            return;
        }

        if (multiple && isArray(selectedData)) {
            const selectedEntities = entitiesRef.current.filter(x => selectedData.some(y => y === x.id));
            onChange(selectedEntities);
            return;
        }

        if (!multiple) {
            const selectedEntity = entitiesRef.current.find(x => selectedData === x.id);
            if (!selectedEntity) {
                throw new Error('Unable to find selected entity');
            }
            onChange(selectedEntity);
            return;
        }

        throw new Error('Inconsistency between selectedData and provided mode');
    };

    const listItems = useMemo(() => {
        if (!entityDefinition) {
            return [];
        }

        return entities.map(entity => {
            const entitySearchFieldName = entity[entityDefinition.getPrimarySearchFieldName()] as string;
            return {
                label: titleFormatter ? titleFormatter(entitySearchFieldName as string) : entitySearchFieldName,
                value: entity.id,
            };
        });
    }, [entities, titleFormatter, entityDefinition]);

    const selectedListItems = useMemo(() => {
        if (!selectedData) {
            return multiple ? [] : null;
        }

        if (multiple && isEntityArray(selectedData)) {
            return selectedData.map(x => x.id);
        }

        if (!multiple && isEntity(selectedData)) {
            return selectedData.id;
        }

        throw new Error('Inconsistency between selectedData and provided mode');
    }, [selectedData, multiple]);

    return (
        <>
            <List.Item title={title} />
            <DropDownListPicker
                selectedItem={selectedListItems}
                items={listItems}
                onItemChanged={onSelectedDataChanged}
                disabled={readonly}
                multiple={multiple}
                loading={loading}
            />
        </>
    );
};
