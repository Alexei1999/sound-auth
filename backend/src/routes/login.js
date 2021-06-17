const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const config = require("../../../config.js");

const { twillioJsm } = require("../../lib/Twillio/index");
const { generatePitch } = require("../helpers/pitch-generator/pitch-generator");
const { recognisePitches } = require("../helpers/pitch-recognition");
const { isPitchesEqual } = require("../helpers/is-pitch-equal");
const { emitStatus, emitCallStatus } = require("../utils/functionalUtils.js");
const { STATUS, EVENTS } = require("../constants/login.js");
const { globalEmitter } = require("../events/emitter.js");

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "../../public"),
    //FIXME: Dev only
    filename: (req, file, cb) => {
      cb(null, "audio.wav");
    },
  }),
});

router.post("/add-chunk", (req, res) => {
  console.log("add-chunk sessionID -> ", req.sessionID);
  console.log("add-chunk session -> ", req.session);
  res.sendStatus(200).end();
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
  // @ts-ignore
  console.log(req.session.target);

  // @ts-ignore
  const status = isPitchesEqual(pitches, req.session.target, true);
  // @ts-ignore
  req.session.call_status = status
    ? STATUS.RESULT.SUCCESS
    : STATUS.RESULT.FAILRUE;

  // @ts-ignore
  emitStatus(req.sessionID, req.session);

  res.sendStatus(200).end();
});

router.post("/auth", async (req, res) => {
  console.log("auth session -> ", req.sessionID);
  console.log("body -> ", req.body);
  const { key, id } = req.body ?? {};

  if (!key) return res.sendStatus(400).end();

  // @ts-ignore
  req.session.target = generatePitch();
  // @ts-ignore
  req.session.device_key = key;
  // @ts-ignore
  req.session.user_id = id;

  res.sendStatus(200).end();
  try {
    switch (key) {
      case "jsm":
        twillioJsm(id, `${config.back.url}/song.wav`);
        break;
      case "WebRTC":
        emitCallStatus(req.sessionID, {
          status: STATUS.CALL.INITIATED,
          called: id,
        });
        globalEmitter.emit(
          EVENTS.SYSTEM.NAME,
          req.sessionID,
          EVENTS.SYSTEM.TRIGGER_CALL
        );
        break;
      default:
        break;
    }
  } catch (e) {
    globalEmitter.emit(
      EVENTS.SYSTEM.NAME,
      req.sessionID,
      EVENTS.SYSTEM.MESSAGE,
      "Метод не зарегестрирован"
    );
  }
});

module.exports = router;
