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
