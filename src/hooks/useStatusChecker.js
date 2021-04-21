import { useEffect } from "react";
import { STATUS } from "src/constants/app-constants";
import { MEDIA_STREAM } from "src/constants/user-media";

export function useStatusChecker({ devicesStatus, methods, setStatus }) {
  useEffect(() => {
    const {
      server: serverStatus,
      microphone: microphoneStatus,
    } = devicesStatus;

    if (
      serverStatus === false ||
      microphoneStatus === MEDIA_STREAM.ERROR.NOT_FOUND
    )
      return setStatus(STATUS.SYSTEM.ERROR);
    if (microphoneStatus === MEDIA_STREAM.ERROR.NOT_ALLOWED)
      return setStatus(STATUS.IDLE);
    if (serverStatus === true && microphoneStatus === true && methods) {
      return setStatus(STATUS.READY);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesStatus.microphone, devicesStatus.server, methods]);
}
