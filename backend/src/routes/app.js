const { Router } = require("express");
const { globalEmitter } = require("../events/emitter");

const router = Router();

const methods = require("../__mocks__/methods.js");
const { emitStatus, emitCallStatus } = require("../utils/functionalUtils");
const { views } = require("../__mocks__/methods.js");
const { emitHandler } = require("../helpers/handlers");

router.get("/health-check", (req, res) => {
  res.sendStatus(204);
});

router.get("/methods", async (req, res) => {
  console.log("methods session -> ", req.sessionID);
  res.json(
    methods.map((method) => ({ ...method, ...views(req.session)[method.key] }))
  );
});

router.get("/get-status", async (req, res) => {
  console.log("emit status");

  // @ts-ignore
  if (!req.session.call_status) globalEmitter.emit(null, req.sessionID);

  // @ts-ignore
  emitStatus(req.sessionID, req.session);

  res.sendStatus(200);
});

router.get("/emitter", emitHandler);

router.post("/webhook", async (req, res) => {
  

  let called = req.body.Called;
  let status = req.body.CallStatus;

  emitCallStatus(req.sessionID, { status, called });
  res.status(204).send();
});

module.exports = router;
