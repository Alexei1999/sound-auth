import { useEffect } from "react";
import { EVENT_SOURCE } from "src/constants/user-media";

export function useCallSSE({
  onMessage = null,
  onOpen = null,
  onInit = null,
  onError = null,
  onRinging = null,
  onInProgress = null,
  onCompleted = null,
  onFailed = null,
  onBusy = null,
  onStatus = null,
}) {
  useEffect(() => {
    console.log("sse method");
    const eventSource = new EventSource("/emitter");

    eventSource.onerror = () => {
      console.log("error");
      onError?.();
    };
    eventSource.onopen = () => {
      console.log("open");
      onOpen?.();
    };
    eventSource.onmessage = (e) => {
      console.log("message");
      onMessage?.(e);
    };
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.INITIATED, () => {
      console.log("init");
      onInit?.();
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.RINGING, () => {
      console.log("ringing");
      onRinging?.();
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.IN_PROGRESS, () => {
      console.log("in progress");
      onInProgress?.();
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.COMPLETED, () => {
      console.log("completed");
      onCompleted?.();
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.FAILED, (number) => {
      console.log("number");
      onFailed?.(number);
    });
    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.BUSY, () => {
      console.log("on busy");
      onBusy?.();
    });
    eventSource.addEventListener(
      EVENT_SOURCE.SYSTEM_EVENT.SEND_STATUS,
      (event) => {
        console.log("status");
        onStatus?.(event);
      }
    );

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
