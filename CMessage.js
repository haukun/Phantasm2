const MSG_REACH_STAIR = 10;
const MSG_DAMAGED = 20;
const MSG_ELEMENTAL_BREAK = 30;
const MSG_PAUSE = 40;
const MSG_GLOW = 50;
const MSG_DEBUG_COMMAND = 90;

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
