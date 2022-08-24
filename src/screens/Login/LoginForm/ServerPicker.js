import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {GlobalStyles} from '../../../config/GlobalStyles';

export const ServerPicker = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [servers, setServers] = useState([]);

  useEffect(() => {
    if (props.servers.length !== servers.length || !servers.every((item, index) => {
      return item.value === props.servers[index].value})) {
      setServers(props.servers);
    }
  }, [props.servers])

  useEffect(() => {
    if (selectedServer !== props.selectedServer) {
      console.log('props.selectedServer');
      setSelectedServer(props.selectedServer);
    }
  }, [props.selectedServer])

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      value={selectedServer}
      setValue={setSelectedServer}
      items={servers}
      setItems={setServers}
      onChangeValue={props.onServerChanged}
      containerStyle={props.containerStyle}
      dropDownContainerStyle={styles.dropDownContainerStyle}
      style={styles.picker}
      disableBorderRadius={true}
    />
  );
};

ServerPicker.propTypes = {
  selectedServer: PropTypes.string,
  servers: PropTypes.array.isRequired,
  onServerChanged: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    borderWidth: 0
  },
  dropDownContainerStyle: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    borderWidth: 0
  },
});
