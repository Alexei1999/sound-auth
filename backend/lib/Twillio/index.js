const twilio = require("twilio");

const {
  url,
  twilio: {
    sid,
    token,
    number,
    api: { name, sid: apiSid, secret },
    app: { sid: appSid },
  },
} = require("../../../config");

const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const client = twilio(sid, token);

const createResponse = (song) => {
  const response = new VoiceResponse();
  response.say(
    {
      language: "ru-RU",
    },
    "Добрый день, сейчас будет проиграна мелодия! Пожалуйста, поднесите устройство к микрофону!"
  );
  response.pause();
  response.play(song);
  return response;
};

const twillio = async (target, song) => {
  const response = createResponse(song);
  return client.calls.create(
    {
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallback: `${url}/webhook`,
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

module.exports = { twillio, getAccessToken };
