import axios from "axios";
import { useEffect } from "react";

export function useMethodsSetter({ toast, setMethods, setDevicesStatus }) {
  useEffect(() => {
    axios
      .get("/methods")
      .then(({ data }) => {
        setMethods(
          // eslint-disable-next-line no-sequences
          data.reduce((obj, method) => ((obj[method?.key] = method), obj), {})
        );
      })
      .catch((e) => {
        console.error(e);
        setDevicesStatus((status) => ({ ...status, server: false }));
        toast.current?.show({
          severity: "error",
          summary: "Ошибка запроса на сервер",
          detail: "Нет связи с сервером, обновите страницу",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
