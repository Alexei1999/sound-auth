const { EVENTS } = require("../constants/login");

const { globalEmitter } = require("../events/emitter");

module.exports.emitDevice = (data) => {
  globalEmitter.emit(EVENTS.SYSTEM.NAME, EVENTS.SYSTEM.SET_DEVICE, data);
};

module.exports.emitCallStatus = ({ status, called }) => {
  globalEmitter.emit(EVENTS.CALL.NAME, status, called);
};

module.exports.emitStatus = ({
  device_key,
  user_id: id,
  call_status: status,
  message,
}) => {
  console.log("to status emit function -> ", device_key, id, status, message);
  globalEmitter.emit(EVENTS.SYSTEM.NAME, EVENTS.SYSTEM.SEND_STATUS, {
    device_key,
    id,
    status,
    message,
  });
};
