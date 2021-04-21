const { Router } = require("express");
const EventEmitter = require("events");
const { views, EVENTS, STATUS } = require("../constants/login");
const path = require("path");
const multer = require("multer");

const config = require("../../../config.js");

const methods = require("../__mocks__/methods.js");
const { twillio, getAccessToken } = require("../../lib/Twillio/index");
const { generatePitch } = require("../helpers/pitch-generator/pitch-generator");
const { recognisePitches } = require("../helpers/pitch-recognition");
const { isPitchesEqual } = require("../helpers/is-pitch-equal");
const VoiceResponse = require("twilio/lib/twiml/VoiceResponse");
const twilio = require("twilio");

const router = Router();

const emitter = new EventEmitter();

const emitStatus = ({ type, user_id: id, call_status: status, message }) => {
  console.log("to emit function");
  emitter.emit(EVENTS.SYSTEM.NAME, EVENTS.SYSTEM.SEND_STATUS, {
    type,
    id,
    status,
    message,
  });
};

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "../../public"),
    //FIXME: Dev only
    filename: (req, file, cb) => {
      cb(null, "audio.wav");
    },
  }),
});

router.post("/connect", twilio.webhook({ validate: false }), (req, res) => {
  console.log("connect");
  var phoneNumber = req.body.phoneNumber;
  var callerId = config.twilio.number;
  var twiml = new VoiceResponse();

  var dial = twiml.dial({ callerId: callerId });
  if (phoneNumber) {
    dial.number({}, phoneNumber);
  } else {
    dial.client({}, "support_agent");
  }

  res.send(twiml.toString());
});

router.get("/token", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ token: getAccessToken() }));
});

router.get("/methods", async (req, res) => {
  res.json(methods.map((method) => ({ ...method, ...views[method.key] })));
});

router.get("/get-status", async (req, res) => {
  console.log("emit status");

  // @ts-ignore
  if (!req.session.call_status) emitter.emit(null);

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
    emitter.off(EVENTS.CALL.NAME, callEventHandler);
    emitter.off(EVENTS.SYSTEM.NAME, systemEventHandler);
    res.end();
  });

  emitter.on(EVENTS.CALL.NAME, callEventHandler);
  emitter.on(EVENTS.SYSTEM.NAME, systemEventHandler);
});

router.post("/webhook", async (req, res) => {
  let status = req.body.CallStatus;
  let called = req.body.Called;

  emitter.emit(EVENTS.CALL.NAME, status, called);
  res.status(204).send();
});

router.post("/verification", upload.single("file"), async (req, res) => {
  // const path = req.file.path;
  console.log("verification");
  const pitches = await recognisePitches(
    path.resolve(__dirname, "../../public/audio.wav")
  );

  console.log("recognited");
  console.log(pitches);
  console.log("target");
  console.log(req.session.target);

  // @ts-ignore
  const status = isPitchesEqual(pitches, req.session.target, true);
  req.session.call_status = status
    ? STATUS.RESULT.SUCCESS
    : STATUS.RESULT.FAILRUE;

  emitStatus(req.session);

  res.sendStatus(200).end();
});

router.post("/auth", async (req, res) => {
  console.log("auth");
  const { key, id } = req.body ?? {};

  if (!key) return res.sendStatus(400).end();

  // @ts-ignore
  req.session.target = generatePitch();
  // @ts-ignore
  req.session.type = key;
  // @ts-ignore
  req.session.user_id = id;

  try {
    switch (key) {
      case "jsm":
        twillio(id, `${config.url}/song.wav`);
        break;
      default:
        break;
    }
  } catch (e) {
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

module.exports = router;
