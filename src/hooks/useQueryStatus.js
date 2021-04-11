import axios from "axios";
import { STATUS } from "src/constants/app-constants";

export function useQueryStatus(toast) {
  return (setLoading) => {
    setLoading?.(true);
    axios
      .get("/get-status")
      .then(
        ({
          data: { type, id, status } = { type: null, id: null, status: null },
        }) => {
          if (!status) {
            return toast.current?.show([
              {
                severity: "info",
                summary: "Пусто",
                detail: "Нет данных",
              },
            ]);
          }

          toast.current?.show([
            {
              severity: "info",
              summary: "Тип",
              detail: type || "null",
            },
            {
              severity: "info",
              summary: "Идентификатор",
              detail: id || "null",
            },
            {
              severity:
                status === STATUS.RESULT.SUCCESS
                  ? "success"
                  : status === STATUS.RESULT.FAILRUE
                  ? "warn"
                  : "info",
              summary: "Статус",
              detail: status || "null",
            },
          ]);
        }
      )
      .catch((e) => {
        console.error(e);
        toast.current?.show({
          severity: "warn",
          summary: "Ошибка",
          detail: "Ошибка запроса на сервер, обновите страницу",
        });
      })
      .finally(() => {
        setLoading?.(false);
      });
  };
}
