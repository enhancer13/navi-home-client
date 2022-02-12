import { showMessage } from 'react-native-flash-message';

export default class Popups {
  static showError(message) {
    showMessage({
      message,
      type: 'danger',
      duration: 10000,
    });
  }

  static showSuccess(message) {
    showMessage({
      message,
      type: 'success',
      duration: 2000,
    });
  }

  static showWarning(message) {
    showMessage({
      message,
      type: 'warning',
      duration: 10000,
    });
  }

  static showInformation(message) {
    showMessage({
      message,
      type: 'info ',
      duration: 5000,
    });
  }
}

const showError = Popups.showError;
const showSuccess = Popups.showSuccess;
const showWarning = Popups.showWarning;
const showInformation = Popups.showInformation;
export { showError, showSuccess, showWarning, showInformation };
