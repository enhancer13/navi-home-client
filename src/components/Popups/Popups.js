import {showMessage} from 'react-native-flash-message';

export default class Popups {
  static showError(message) {
    showMessage({
      message,
      type: 'danger',
    });
  }

  static showSuccess(message) {
    showMessage({
      message,
      type: 'success',
    });
  }
}

const showError = Popups.showError;
const showSuccess = Popups.showSuccess;
export {showError, showSuccess};
