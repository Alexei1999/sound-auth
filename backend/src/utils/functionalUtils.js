const { EVENTS } = require("../constants/login");

const { globalEmitter } = require("../events/emitter");

module.exports.emitDevice = (sessionID, data) => {
  globalEmitter.emit(
    EVENTS.SYSTEM.NAME,
    sessionID,
    EVENTS.SYSTEM.SET_DEVICE,
    data
  );
};

module.exports.emitCallStatus = (sessionID, { status, called }) => {
  globalEmitter.emit(EVENTS.CALL.NAME, sessionID, status, called);
};

module.exports.emitStatus = (
  sessionID,
  { device_key, user_id: id, call_status: status, message }
) => {
  console.log("to status emit function -> ", device_key, id, status, message);
  globalEmitter.emit(EVENTS.SYSTEM.NAME, sessionID, EVENTS.SYSTEM.SEND_STATUS, {
    device_key,
    id,
    status,
    message,
  });
};
