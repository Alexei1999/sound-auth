module.exports.STATUS = {
  CALL: {
    IDLE: "IDLE",
    LOADING: "LOADING",
    ERROR: "ERROR",
    READY: "READY",
    RINGING: "RINGING",
    IN_PROGRESS: "IN_PROGRESS",
  },
  RESULT: {
    SUCCESS: "SUCCESS",
    FAILRUE: "FAILRUE",
  },
};

module.exports.views = {
  jsm: {
    mask: "+999 (99) 999-99-99",
    placeholder: "+XXX (XX) XXX-XX-XX",
  },
  telegram: {
    mask: "@aaaaaaa",
    placeholder: "@telegram_id",
  },
  whatsup: {
    mask: "+999 (99) 999-99-99",
    placeholder: "+XXX (XX) XXX-XX-XX",
  },
  sip: {
    mask: "+999 (99) 999-99-99",
    placeholder: "+XXX (XX) XXX-XX-XX",
  },
};
