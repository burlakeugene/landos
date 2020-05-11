import { store } from 'store';

class Status {
  constructor() {
    this.queue = [];
    this.statusChange = this.statusChange.bind(this);
    this.loaderOn = this.loaderOn.bind(this);
    this.loaderOff = this.loaderOff.bind(this);
    this.messagePush = this.messagePush.bind(this);
  }
  getCurrentState(prop) {
    let state = store.getState().statusReducer.status;
    return prop ? state[prop] : state;
  }
  loaderOn() {
    this.statusChange({
      visible: true,
      type: 'loading',
      message: '',
    });
  }
  loaderOff() {
    this.statusChange({
      visible: false
    });
  }
  messagePush(data) {
    this.queue.push(data);
    this.checkForMessage();
  }
  checkForMessage() {
    let visible = this.getCurrentState('visible');
    if (visible) return;
    let message = this.queue.shift();
    if (!message) return;
    this.statusChange({
      ...message,
      visible: true,
    });
  }
  statusChange(data) {
    let action = {
      type: 'STATUS_CHANGE',
      payload: data,
      delay: data.delay,
    };
    store.dispatch(action);
    this.checkForMessage();
    if (action.delay) {
      setTimeout(() => {
        this.statusChange({
          visible: false
        });
      }, action.delay);
    }
  }
}

Status = new Status();

const loaderOn = Status.loaderOn;
const loaderOff = Status.loaderOff;
const messagePush = Status.messagePush;
export { loaderOn, loaderOff, messagePush };
