const twilio = require("twilio");
const config = require("../../../config");

const {
  twilio: {
    number,
    account: { sid, token },
    api: { name, sid: apiSid, secret },
    app: { sid: appSid },
  },
  back,
} = config;

const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const client = twilio(sid, token);

const createTwimlJsmResponse = (song) => {
  const response = new VoiceResponse();
  response.say(
    {
      language: "ru-RU",
    },
    "Добрый день, сейчас будет проиграна мелодия! Пожалуйста, поднесите устройство к микрофону!"
  );
  response.pause();
  response.play({ loop: 2 }, song);
  return response;
};

const createTwimlWebRTCResponse = (song) => {
  const response = new VoiceResponse();

  response.say(
    {
      language: "ru-RU",
    },
    "Добрый день, сейчас будет проиграна мелодия! Пожалуйста, поднесите устройство к микрофону!"
  );
  response.pause();
  response.play({ loop: 2 }, song);
  return response;
};

const twillioJsm = async (target, song) => {
  const response = createTwimlJsmResponse(song);
  return client.calls.create(
    {
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallback: `${back.url}/webhook`,
      twiml: response.toString(),
      from: number,
      to: target,
    },
    (error) => {
      console.error(error);
    }
  );
};

const getAccessToken = () => {
  const accessToken = new AccessToken(sid, apiSid, secret);
  accessToken.identity = name;

  const grant = new VoiceGrant({
    outgoingApplicationSid: appSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);
  return accessToken.toJwt();
};

module.exports = {
  twillioJsm,
  getAccessToken,
  createTwimlJsmResponse,
  createTwimlWebRTCResponse,
  client,
};
