const { Router } = require("express");
const { globalEmitter } = require("../events/emitter");

const router = Router();

const methods = require("../__mocks__/methods.js");
const { views, EVENTS } = require("../constants/login");
const { emitStatus } = require("../utils/functionalUtils");

router.get("/methods", async (req, res) => {
  res.json(methods.map((method) => ({ ...method, ...views[method.key] })));
});

router.get("/get-status", async (req, res) => {
  console.log("emit status");

  // @ts-ignore
  if (!req.session.call_status) globalEmitter.emit(null);

  // @ts-ignore
  emitStatus(req.session);

  res.sendStatus(200).end();
});

router.get("/emitter", async (req, res) => {
  let id = 0;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-transform",
    Connection: "keep-alive",
  });

  console.log("opened");
  res.write(`event: open\ndata: open\nid: ${id++}\n\n`);

  const callEventHandler = (name, data) => {
    console.log(`sended event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
    res.write(`event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
  };

  const systemEventHandler = (type, data) => {
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
      default:
    }
  };

  res.on("close", () => {
    console.log("closed");
    globalEmitter.off(EVENTS.CALL.NAME, callEventHandler);
    globalEmitter.off(EVENTS.SYSTEM.NAME, systemEventHandler);
    res.end();
  });

  globalEmitter.on(EVENTS.CALL.NAME, callEventHandler);
  globalEmitter.on(EVENTS.SYSTEM.NAME, systemEventHandler);
});

router.post("/webhook", async (req, res) => {
  console.log("piska -> ", req.body);
  let called = req.body.Called;
  let status = req.body.CallStatus;

  globalEmitter.emit(EVENTS.CALL.NAME, status, called);
  res.status(204).send();
});

module.exports = router;
