import { STATUS } from "src/constants/app-constants";

export const validate = (type, id = "", items = {}) => {
  switch (type) {
    case "jsm":
      return /\+\d{3} \(\d\d\) \d{3}-\d\d-\d\d/.test(id);
    case "WebRTC":
      return items.deviceStatus === STATUS.RESULT.SUCCESS;
    default:
      return true;
  }
};
