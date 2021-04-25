module.exports.STATUS = {
  CALL: {
    IDLE: "IDLE",
    LOADING: "LOADING",
    ERROR: "ERROR",
    READY: "READY",
    INITIATED: "initiated",
    RINGING: "RINGING",
    IN_PROGRESS: "IN_PROGRESS",
  },
  RESULT: {
    SUCCESS: "SUCCESS",
    FAILRUE: "FAILRUE",
  },
};

module.exports.EVENTS = {
  CALL: { NAME: "call" },
  SYSTEM: {
    NAME: "system",
    SEND_STATUS: "send-status",
    SET_DEVICE: "set_device",
    MESSAGE: "message",
    GET_DEVICE: "get_device",
    TRIGGER_CALL: "trigger-call",
  },
};

const TYPES = {
  INPUT: "INPUT",
  INDICATOR: "INDICATOR",
};

module.exports.TYPES = TYPES;
