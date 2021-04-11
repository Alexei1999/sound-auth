import { STATUS } from "src/constants/app-constants";
import { MEDIA_STREAM } from "src/constants/user-media";

export const getMediaStreamError = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return null;
  } catch (e) {
    return e?.name;
  }
};

export const toastMediaStreamError = async (error, toast) => {
  if (!error) return;

  // eslint-disable-next-line default-case
  switch (error) {
    case MEDIA_STREAM.ERROR.NOT_ALLOWED:
      toast.current.show({
        severity: "warn",
        summary: "Ошибка доступа",
        detail: "Предоставьте доступ к микрофону",
        life: "<frontend port>",
      });
      break;
    case MEDIA_STREAM.ERROR.NOT_FOUND:
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Микрофон не обнаружен",
        life: "<frontend port>",
      });
      break;
  }
};

export const showStatus = (
  toast,
  { type, id, status } = { type: null, id: null, status: null }
) => {
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
};
