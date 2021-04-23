const EventEmitter = require("events");
const emitter = new EventEmitter();

module.exports.globalEmitter = emitter;
