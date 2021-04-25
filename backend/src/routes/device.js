const {
  createTwimlWebRTCResponse,
  getAccessToken,
} = require("../../lib/Twillio");
const { Router } = require("express");
const twilio = require("twilio");
const config = require("../../../config.js");
const { emitDevice } = require("../utils/functionalUtils");
const { STATUS, EVENTS } = require("../constants/login");
const { globalEmitter } = require("../events/emitter");
const { emitHandler } = require("../helpers/handlers");
const router = Router();

router.get("/token", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ token: getAccessToken() }));
});

router.get("/device-status", (req, res) => {
  globalEmitter.emit(EVENTS.SYSTEM.NAME, EVENTS.SYSTEM.GET_DEVICE);
  res.sendStatus(204);
});

router.post("/device-status", (req, res) => {
  const { isReady, deviceName } = req.body;

  // @ts-ignore
  req.session.deviceStatus = isReady
    ? STATUS.RESULT.SUCCESS
    : STATUS.RESULT.FAILRUE;
  // @ts-ignore
  req.session.deviceName = deviceName;
  res.sendStatus(204);

  emitDevice({
    key: "WebRTC",
    deviceStatus: isReady ? STATUS.RESULT.SUCCESS : STATUS.RESULT.FAILRUE,
    deviceName,
  });
});

router.post(
  "/device",
  twilio.webhook({
    validate: false,
  }),
  (req, res) => {
    console.log("connect -> ", `${config.back.url}/song.wav`);
    const twiml = createTwimlWebRTCResponse(`${config.back.url}/song.wav`);
    console.log(twiml.toString());

    res.send(twiml.toString());
  }
);

router.get("/device-emitter", async (req, res) => {
  return emitHandler(req, res, () => {
    console.log("disable divace");
    emitDevice({
      key: "WebRTC",
      deviceStatus: null,
      deviceName: null,
    });
  });
});

module.exports = router;
