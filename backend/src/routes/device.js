const {
  createTwimlWebRTCResponse,
  getAccessToken,
} = require("../../lib/Twillio");
const { Router } = require("express");
const twilio = require("twilio");
const config = require("../../../config.js");

const router = Router();

router.get("/token", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ token: getAccessToken() }));
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

module.exports = router;
