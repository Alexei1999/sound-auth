import { useEffect } from "react";
import {
  getMediaStreamError,
  toastMediaStreamError,
} from "src/utils/functionalUtils";

export function useMediaStreamSetter({ setDevicesStatus }) {
  useEffect(() => {
    (async () => {
      const error = await getMediaStreamError();
      if (error) {
        setDevicesStatus((status) => ({ ...status, microphone: error }));
        toastMediaStreamError(error);
      } else {
        setDevicesStatus((status) => ({ ...status, microphone: true }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
