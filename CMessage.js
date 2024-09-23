const MSG_REACH_STAIR = 10;
const MSG_DAMAGED = 20;
const MSG_ELEMENTAL_BREAK = 30;

class CMessage {
  constructor() {
    this.msgs = [];
  }

  send(obj) {
    this.msgs.push(obj);
  }

  get() {
    return this.msgs.shift();
  }
}
