const { EVENTS } = require("../constants/login");

module.exports.getHandlers = (res, id, currentSessionId, userId, session) => ({
  callEventHandler: (sessionId, name, data) => {
    console.log(
      "siska",
      "target sessionId -> ",
      sessionId,
      "current sessionId -> ",
      currentSessionId,
      "current data -> ",
      userId,
      "target data -> ",
      data,
      "current session -> ",
      session
    );
    // if (currentSessionId !== sessionId) {
    //   console.log("!!!", currentSessionId, sessionId);
    //   console.log(`blocked event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
    //   return console.log("call event session doesnot match");
    // }
    console.log(`sended event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
    res.write(`event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
  },
  systemEventHandler: (sessionId, type, data) => {
    console.log("on switch -> ", type, data);
    switch (type) {
      case EVENTS.SYSTEM.SEND_STATUS:
        // if (currentSessionId !== sessionId) {
        //   return console.log(
        //     EVENTS.SYSTEM.SEND_STATUS,
        //     ": event session doesnot match"
        //   );
        // }
        res.write(
          `event: ${type}\ndata: ${JSON.stringify(data)}\nid: ${id++}\n\n`
        );
        break;
      case EVENTS.SYSTEM.MESSAGE:
        res.write(`data: ${data}\nid: ${id++}\n\n`);
        break;
      case EVENTS.SYSTEM.GET_DEVICE:
        res.write(`event: ${type}\ndata: null\nid: ${id++}\n\n`);
        break;
      case EVENTS.SYSTEM.SET_DEVICE:
        res.write(
          `event: ${type}\ndata: ${JSON.stringify(data)}\nid: ${id++}\n\n`
        );
        break;
      default:
        res.write(`event: ${type}\ndata: null\nid: ${id++}\n\n`);
        break;
    }
  },
});
