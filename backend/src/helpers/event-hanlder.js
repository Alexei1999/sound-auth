const { EVENTS } = require("../constants/login");

module.exports.getHandlers = (res, id) => ({
  callEventHandler: (name, data) => {
    console.log(`sended event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
    res.write(`event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
  },
  systemEventHandler: (type, data) => {
    console.log("on switch -> ", type, data);
    switch (type) {
      case EVENTS.SYSTEM.SEND_STATUS:
        res.write(
          `event: ${type}\ndata: ${JSON.stringify(data)}\nid: ${id++}\n\n`
        );
        break;
      case EVENTS.SYSTEM.MESSAGE:
        res.write(`data: ${data}\nid: ${id++}\n\n`);
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
