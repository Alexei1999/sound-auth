import { useEffect } from "react";
import { STATUS } from "src/constants/app-constants";
import { EVENT_SOURCE } from "src/constants/user-media";

export function useSSESetter({
  toast,
  status,
  queryStatus,
  setStatus,
  setDevicesStatus,
}) {
  useEffect(() => {
    const eventSource = new EventSource("/emitter");

    eventSource.onerror = () => {
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Нет связи с сервером, обновите страницу",
      });

      setDevicesStatus((status) => ({ ...status, server: false }));
    };
    eventSource.onopen = () => {
      setDevicesStatus((status) => ({ ...status, server: true }));
    };

    // eventSource.onmessage = (e) => console.log("mesage", e);

    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.RINGING, () => {
      setStatus(STATUS.CALL.RINGING);
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.IN_PROGRESS, () => {
      setStatus(STATUS.CALL.IN_PROGRESS);
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.COMPLETED, () => {
      toast.current?.show({
        severity: "success",
        summary: "Успех",
        detail: "Вызов успешно завершен",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
      queryStatus();
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.FAILED, () => {
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Ошибка вызова",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.BUSY, () => {
      toast.current?.show({
        severity: "warn",
        summary: "Занято",
        detail: "Вызов сброшен",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
    });

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
