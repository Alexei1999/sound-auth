import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { useContextDispatch } from "src/reducers/reducer";
import { actionCreators } from "src/reducers/actions";

export const ToastContext = React.createContext(null);

const checkProvider = (context) => {
  if (context === null) throw Error("Toast hook used without ContextProvider");
  return context;
};

export const useToast = () => {
  const dispatch = useContextDispatch();
  const toast = checkProvider(React.useContext(ToastContext));

  const showToast = (severity, summary, detail) => {
    if (!toast.current) return;
    toast.current?.show({
      severity,
      summary,
      detail,
    });
    dispatch(actionCreators.toggleToast());
  };

  const toastWarn = Object.assign(showToast.bind(null, "info"), {
    severity: "warn",
  });
  const toastError = Object.assign(showToast.bind(null, "error"), {
    severity: "error",
  });
  const toastInfo = Object.assign(showToast.bind(null, "info"), {
    severity: "info",
  });
  const toastSuccess = Object.assign(showToast.bind(null, "success"), {
    severity: "success",
  });
  const toastMany = (payload) => toast.current?.show(payload);

  return { toastInfo, toastSuccess, toastWarn, toastError, toastMany };
};

export function ToastProvider({ children }) {
  const toast = useRef(null);

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}
