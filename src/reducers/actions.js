const { actionTypes } = require("./types");

export const actionCreators = {
  setIsTone: (payload) => ({
    type: actionTypes.SET_TONE,
    payload,
  }),
  setMicrophoneStatus: (payload, error = null) => ({
    type: actionTypes.SET_MICROPHONE_STATUS,
    payload,
    error,
  }),
  setServerStatus: (payload) => ({
    type: actionTypes.SET_SERVER_STATUS,
    payload,
  }),
  selectItemByKey: (payload) => ({
    type: actionTypes.SELECT_ITEM,
    payload,
  }),
  selectExtraItem: (payload) => ({
    type: actionTypes.SELECT_EXTRA_ITEM,
    payload,
  }),
  setIsActive: (payload) => ({
    type: actionTypes.SET_ACTIVE,
    payload,
  }),
  setIsSpinner: (payload) => ({
    type: actionTypes.SET_SPINNER,
    payload,
  }),
  setMethods: (payload) => ({
    type: actionTypes.SET_METHODS,
    payload,
  }),
  setDevice: (payload) => ({
    type: actionTypes.SET_DEVICE,
    payload,
  }),
  toggleToast: () => ({
    type: actionTypes.TOGGLE_TOAST,
  }),
  setStatus: (payload) => ({
    type: actionTypes.SET_STATUS,
    payload,
  }),
};
