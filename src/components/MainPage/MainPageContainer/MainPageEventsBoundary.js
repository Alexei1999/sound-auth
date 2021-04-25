import React from "react";
import { useEffect } from "react";
import { STATUS } from "src/constants/app-constants";
import { EVENT_SOURCE } from "src/constants/user-media";
import { actionCreators } from "src/reducers/actions";
import { useContextApp } from "src/reducers/reducer";
import { useToast } from "../../shared/ToastProvider";

export function MainPageEventsBoundary({ children }) {
  const fuck = useToast();
  console.log("error boundary -> ", fuck);
  const { toastInfo, toastSuccess, toastWarn, toastError, toastMany } = fuck;

  const [state, dispatch] = useContextApp();

  const { status } = state;

  useEffect(() => {
    console.log("sse method");
    const eventSource = new EventSource("/emitter");

    eventSource.onerror = () => {
      toastError("Ошибка", "Нет связи с сервером, обновите страницу");
      dispatch(actionCreators.setServerStatus(false));
    };
    eventSource.onopen = () => {
      console.log("open");
      dispatch(actionCreators.setServerStatus(true));
    };
    eventSource.onmessage = (e) => toastInfo("Сообщение", e.data);
    eventSource.addEventListener(EVENT_SOURCE.SYSTEM_EVENT.SET_DEVICE, (e) => {
      console.log("device");
      try {
        const data = JSON.parse(e.data);

        if (!data.key)
          return toastError(
            "Ошибка устройства",
            "Не удалось обновить статус устройства, обновите страницу"
          );

        console.log("receive device data -> ", data);
        dispatch(actionCreators.setIsActive(false));
        dispatch(actionCreators.setDevice(data));
      } catch (e) {
        console.error(e);
      }
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.INITIATED, () => {
      console.log("init");
      toastInfo("Совершается вызов", "Вызов инициализирован", false);
      dispatch(actionCreators.setIsSpinner(false));
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.RINGING, () =>
      dispatch(actionCreators.setStatus(STATUS.CALL.RINGING))
    );
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.IN_PROGRESS, () => {
      console.log("in progress");
      dispatch(actionCreators.setStatus(STATUS.CALL.IN_PROGRESS));
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.COMPLETED, () => {
      console.log("completed");
      toastSuccess("Успех", "Вызов успешно завершен");
      if (status !== STATUS.SYSTEM.ERROR)
        dispatch(actionCreators.setStatus(STATUS.READY));
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.FAILED, (event) => {
      console.log("number");
      toastError(
        "Ошибка вызова",
        "Невозможно набрать номер " + event.data || "null"
      );
      if (status !== STATUS.SYSTEM.ERROR)
        dispatch(actionCreators.setStatus(STATUS.READY));
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.BUSY, () => {
      console.log("on busy");
      toastWarn("Занято", "Вызов сброшен");
      if (status !== STATUS.SYSTEM.ERROR)
        dispatch(actionCreators.setStatus(STATUS.READY));
    });
    eventSource.addEventListener(EVENT_SOURCE.SYSTEM_EVENT.HEALTH, () => {});
    eventSource.addEventListener(
      EVENT_SOURCE.SYSTEM_EVENT.SEND_STATUS,
      (event) => {
        console.log("status");
        try {
          // @ts-ignore
          const { device_key, id, status, message } = event.data;

          if (!status) {
            return toastInfo("Пусто", "Нет данных");
          }

          const severity =
            status === STATUS.RESULT.SUCCESS
              ? "success"
              : status === STATUS.RESULT.FAILRUE
              ? "warn"
              : "info";

          const result =
            status === STATUS.RESULT.SUCCESS
              ? "Успешно"
              : status === STATUS.RESULT.FAILRUE
              ? "Провалено"
              : "Статус";

          toastMany([
            ...(message
              ? [
                  {
                    severity: "info",
                    summary: "Сообщение",
                    detail: message,
                  },
                ]
              : []),
            {
              severity,
              summary: `${result} - тип: ${device_key || "Нет типа вызова"}`,
              detail: `Id: ${id || "Нет идентификатора"}`,
            },
          ]);
        } catch (e) {
          console.error(e);
        }
      }
    );

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
