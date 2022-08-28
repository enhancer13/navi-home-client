import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StatusLabel} from './StatusLabel';
import {GlobalStyles} from '../../../config/GlobalStyles';
import PropTypes from 'prop-types';
import {DropDownListPicker} from '../../DropDownListPicker';
import Pagination from '../../../helpers/Pagination';

const uniqueKey = 'id';

const LabeledAjaxDropDownListPicker = (props) => {
  const {label, fieldStatus, editable, selectedData, onChange, multiple, paginationData, itemLabelFormatter} = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      setLoading(true);
      this.pagination = new Pagination(paginationData);
      try {
        await this.pagination.fetchPage((response) => {
          if (!isCancelled) {
            setData([...response.data]);
          }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData().catch(err => console.error(err.message))

    return () => {
      isCancelled = true;
    }
  }, []);

  const onSelectedDataChanged = useCallback((values) => {
    if (data.length === 0) {
      return;
    }
    if (values === null) {
      onChange(null);
      return;
    }
    if (multiple) {
      const selectedItems = data.filter(x => values.some(val => val === x[uniqueKey]));
      onChange(selectedItems);
      return;
    }
    const selectedItem = data.find(x => values === x[uniqueKey]);
    onChange(selectedItem);
  }, [data]);

  const items = useMemo(() => {
    return data.map(x => {
      let itemLabel = x[paginationData.searchFieldName]
      itemLabel = itemLabelFormatter ? itemLabelFormatter(itemLabel) : itemLabel;
      return {
        label: itemLabel,
        value: x[uniqueKey]
      }
    })
  }, [data])

  const selectedItems = useMemo(() => {
    if (selectedData === null) {
      return null;
    }
    if (typeof selectedData === undefined) {
      return multiple ? [] : null;
    }
    return multiple ? selectedData.map(x => x[uniqueKey]) : selectedData[uniqueKey];
  }, [selectedData])

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>{label}</Text>
        <StatusLabel style={styles.statusLabel} status={fieldStatus}/>
      </View>
      <View style={styles.rowContainer}>
        <DropDownListPicker
          selectedItem={selectedItems}
          items={items}
          onItemChanged={onSelectedDataChanged}
          disabled={!editable}
          multiple={multiple}
          loading={loading}
        />
      </View>
    </View>
  );
};

LabeledAjaxDropDownListPicker.propTypes = {
  label: PropTypes.string.isRequired,
  selectedData: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
  ]),
  fieldStatus: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  paginationData: PropTypes.object.isRequired,
  itemLabelFormatter: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  label: {
    color: GlobalStyles.greyTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
  rowContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
  },
  statusLabel: {
    marginLeft: 10,
  },
});

export default LabeledAjaxDropDownListPicker;
