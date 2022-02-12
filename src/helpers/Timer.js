export default class Timer {
  constructor(callback, scheduleMsList) {
    this.callback = callback;
    this.scheduleMsList = scheduleMsList;
    this.timer = null;
    this.tries = 1;
  }

  reset() {
    this.tries = 1;
    clearTimeout(this.timer);
  }

  scheduleTimeout() {
    clearTimeout(this.timer);
    if (this.tries > this.scheduleMsList.length) {
      return false;
    }
    const scheduleMs = this.scheduleMsList[this.tries - 1];
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, scheduleMs);
    return true;
  }
}
