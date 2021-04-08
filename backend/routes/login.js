const { Router } = require("express");
const EventEmitter = require("events");

const router = Router();
const emitter = new EventEmitter();

router.get("/emitter", async (req, res) => {
  let id = 0;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  res.write(`event: open\ndata: open\nid: ${id++}\n\n`);

  const emitHandler = (name, data) => {
    res.write(`event: ${name}\ndata: ${data}\nid: ${id++}\n\n`);
    if (name === "close") {
      emitter.off("event", emitHandler);
      res.sendStatus(204);
    }
  };

  res.on("close", () => emitter.off("event", emitHandler));
  emitter.on("event", emitHandler);
});

module.exports = router;
