import React from 'react';
import Dialog from 'react-native-dialog';
import PropTypes from 'prop-types';

function ConfirmationDialog(props) {
  const { message, visible, onConfirm, onCancel } = props;
  const title = 'Confirm action';
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{message}</Dialog.Description>
      <Dialog.Button label="Cancel" onPress={onCancel} />
      <Dialog.Button label="Confirm" onPress={onConfirm} />
    </Dialog.Container>
  );
}

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export { ConfirmationDialog };
