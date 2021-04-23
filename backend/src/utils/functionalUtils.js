const { EVENTS } = require("../constants/login");

const { globalEmitter } = require("../events/emitter");

module.exports.emitStatus = ({
  type,
  user_id: id,
  call_status: status,
  message,
}) => {
  console.log("to emit function");
  globalEmitter.emit(EVENTS.SYSTEM.NAME, EVENTS.SYSTEM.SEND_STATUS, {
    type,
    id,
    status,
    message,
  });
};
