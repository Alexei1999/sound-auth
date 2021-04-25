const { TYPES } = require("../constants/login");

module.exports = [
  {
    key: "jsm",
    name: "Звонок",
  },
  {
    key: "telegram",
    name: "Telegram",
  },
  {
    key: "WebRTC",
    name: "WebRTC",
  },
  {
    key: "sip",
    name: "IP-телефония",
  },
];

module.exports.views = (session) => ({
  jsm: {
    type: TYPES.INPUT,
    mask: "+999 (99) 999-99-99",
    placeholder: "+XXX (XX) XXX-XX-XX",
  },
  telegram: {
    type: TYPES.INPUT,
    mask: "@aaaaaaa",
    placeholder: "@telegram_id",
  },
  WebRTC: {
    type: TYPES.INDICATOR,
    deviceStatus: session.deviceStatus,
  },
  sip: {
    type: TYPES.INPUT,
    mask: "+999 (99) 999-99-99",
    placeholder: "+XXX (XX) XXX-XX-XX",
  },
});
