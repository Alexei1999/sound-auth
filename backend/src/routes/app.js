const { Router } = require("express");
const { globalEmitter } = require("../events/emitter");

const router = Router();

const methods = require("../__mocks__/methods.js");
const { EVENTS } = require("../constants/login");
const { emitStatus, emitCallStatus } = require("../utils/functionalUtils");
const { views } = require("../__mocks__/methods.js");
const { emitHandler } = require("../helpers/handlers");

router.get("/health-check", (req, res) => {
  res.sendStatus(204);
});

router.get("/methods", async (req, res) => {
  res.json(
    methods.map((method) => ({ ...method, ...views(req.session)[method.key] }))
  );
});

router.get("/get-status", async (req, res) => {
  console.log("emit status");

  // @ts-ignore
  if (!req.session.call_status) globalEmitter.emit(null);

  // @ts-ignore
  emitStatus(req.session);

  res.sendStatus(200).end();
});

router.get("/emitter", emitHandler);

router.post("/webhook", async (req, res) => {
  console.log("piska -> ", req.body);
  let called = req.body.Called;
  let status = req.body.CallStatus;

  emitCallStatus({ status, called });
  res.status(204).send();
});

module.exports = router;
