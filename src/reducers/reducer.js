import React, { useReducer } from "react";
import { STATUS } from "src/constants/app-constants";
import { actionTypes } from "./types";

export const ContextApp = React.createContext(null);

const checkProvider = (context) => {
  if (context === null) throw Error("Store hook used without ContextProvider");
  return context;
};

export const useContextApp = () => checkProvider(React.useContext(ContextApp));

export const useContextStore = () => {
  const [store] = checkProvider(React.useContext(ContextApp));
  return store;
};

export const useContextDispatch = () => {
  const [, dispatch] = checkProvider(React.useContext(ContextApp));
  return dispatch;
};

const initialState = {
  devices: {
    microphone: null,
    microphoneError: null,
    server: null,
  },
  form: {
    isTone: true,
    item: null,
    selectedKey: null,
    selectedExtraKey: null,
    methods: null,
  },
  view: {
    isActive: false,
    type: null,
    isExtra: false,
    isSpinner: false,
  },
  toastRef: {},
  status: STATUS.SYSTEM.LOADING,
};

const mainReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_MICROPHONE_STATUS:
      return {
        ...state,
        devices: {
          ...state.devices,
          microphone: action.payload,
          microphoneError: action.error,
        },
      };
    case actionTypes.SET_SERVER_STATUS:
      return {
        ...state,
        devices: {
          ...state.devices,
          server: action.payload,
        },
      };
    case actionTypes.SELECT_ITEM:
      const item = state.form.methods?.[action.payload];
      if (!item)
        return {
          ...state,
        };
      return {
        ...state,
        form: {
          ...state.form,
          item,
          selectedKey: action.payload,
        },
        view: {
          ...state.view,
          type: item.type,
          isExtra: Boolean(item.extra),
        },
      };
    case actionTypes.SELECT_EXTRA_ITEM:
      return {
        ...state,
        selectedExtraKey: action.payload,
      };
    case actionTypes.SET_ACTIVE:
      return {
        ...state,
        view: {
          ...state.view,
          isActive: action.payload,
        },
      };
    case actionTypes.SET_SPINNER:
      return {
        ...state,
        view: {
          ...state.view,
          isSpinner: action.payload,
        },
      };
    case actionTypes.SET_METHODS:
      if (!action.payload)
        return {
          ...state,
        };
      const methods = action.payload.reduce((obj, method) => {
        obj[method?.key] = method;
        return obj;
      }, {});

      return {
        ...state,
        form: {
          ...state.form,
          methods,
        },
      };
    case actionTypes.SET_DEVICE:
      const device = action.payload;
      if (!device?.key) return { ...state };

      return {
        ...state,
        form: {
          ...state.form,
          methods: {
            ...state.form.methods,
            [device.key]: { ...state.form.methods?.[device.key], ...device },
          },
        },
      };
    case actionTypes.TOGGLE_TOAST:
      return {
        ...state,
        view: {
          ...state.view,
          isSpinner: false,
        },
        toast: {},
      };
    case actionTypes.SET_STATUS:
      return {
        ...state,
        view: {
          ...state.view,
          isSpinner: false,
        },
        status: action.payload,
      };
    case actionTypes.SET_TONE:
      return {
        ...state,
        form: {
          ...state.form,
          isTone: action.payload,
        },
      };
    default:
      return state;
  }
};

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <ContextApp.Provider value={[state, dispatch]}>
      {children}
    </ContextApp.Provider>
  );
}
