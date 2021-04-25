export const EVENT_SOURCE = {
  SYSTEM_EVENT: {
    MESSAGE: "message",
    INFO: "info",
    SEND_STATUS: "send-status",
    TRIGGER_CALL: "trigger-call",
    SET_DEVICE: "set_device",
    GET_DEVICE: "get_device",
    HEALTH: "health",
  },
  CALL_EVENT: {
    RINGING: "ringing",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    BUSY: "busy",
    FAILED: "failed",
    NO_ANSWER: "no-answer",
    ERROR: "error",
    INITIATED: "initiated",
  },
};

export const MEDIA_STREAM = {
  EVENT: {
    DATA_AVALIABLE: "dataavailable",
    STOP: "stop",
  },
  ERROR: {
    NOT_ALLOWED: "NotAllowedError",
    NOT_FOUND: "NotFoundError",
  },
};
