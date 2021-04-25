const { EVENTS } = require("../constants/login");
const { globalEmitter } = require("../events/emitter");
const { getHandlers } = require("./event-hanlder");

module.exports.emitHandler = async (req, res, callback) => {
  let id = 0;

  const { callEventHandler, systemEventHandler } = getHandlers(res, id);

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-transform",
    Connection: "keep-alive",
  });

  console.log("opened");
  res.write(`event: open\ndata: open\nid: ${id++}\n\n`);

  const healthChecker = setInterval(() => {
    res.write(`event: health\ndata: ❤\nid: ${id++}\n\n`);
  }, 1500);

  const closeConnection = () => {
    clearInterval(healthChecker);
    globalEmitter.off(EVENTS.CALL.NAME, callEventHandler);
    globalEmitter.off(EVENTS.SYSTEM.NAME, systemEventHandler);
    res.end();
  };

  res.on("error", () => {
    console.log("error");
    callback?.("error");
    closeConnection();
  });
  res.on("close", () => {
    console.log("closed");
    callback?.("close");
    closeConnection();
  });

  globalEmitter.on(EVENTS.CALL.NAME, callEventHandler);
  globalEmitter.on(EVENTS.SYSTEM.NAME, systemEventHandler);
};
