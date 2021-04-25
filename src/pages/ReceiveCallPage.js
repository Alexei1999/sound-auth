import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import axios from "axios";
import { initMediaStream } from "src/utils/functionalUtils";
import { Toast } from "primereact/toast";
import { CallInProgress } from "src/components/ReceiveCallPage/CallInProgress";
import { EVENT_SOURCE } from "src/constants/user-media";
import { CONNECT_STATUS, Status } from "src/components/ReceiveCallPage/Status";
const { Device } = require("twilio-client");

export function ReceiveCallPage() {
  const [deviceStatus, setDeviceStatus] = useState(CONNECT_STATUS.IDLE);
  const [tokenStatus, setTokenStatus] = useState(CONNECT_STATUS.IDLE);
  const [mediaStatus, setMediaStatus] = useState(CONNECT_STATUS.IDLE);
  const [eventsStatus, setEventsStatus] = useState(CONNECT_STATUS.IDLE);
  const [isInProgress, setIsInProgress] = useState(false);
  const [isCriticalShowed, setIsCriticialShowed] = useState(false);

  const isReady = useRef(false);
  const deviceRef = useRef(null);

  const toast = useRef(null);

  useEffect(() => {
    if (
      !isCriticalShowed &&
      [deviceStatus, tokenStatus, mediaStatus, eventsStatus].some(
        (status) => status === CONNECT_STATUS.FAILED
      )
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Связь не может быть установлена",
      });
      setIsCriticialShowed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceStatus, tokenStatus, mediaStatus, eventsStatus]);

  useEffect(() => {
    setEventsStatus(CONNECT_STATUS.REQUESTING);
    const eventSource = new EventSource("/device-emitter");

    eventSource.onerror = (e) => {
      setEventsStatus(CONNECT_STATUS.FAILED);
      console.log("error -> ", e);
    };
    eventSource.onopen = () => {
      setEventsStatus(CONNECT_STATUS.CONNECTED);
      console.log("open");
    };
    eventSource.onmessage = (e) => {
      console.log("message");
    };

    eventSource.addEventListener(EVENT_SOURCE.SYSTEM_EVENT.TRIGGER_CALL, () => {
      console.log("call triggered! -> ", isReady.current, deviceRef.current);
      if (isReady.current) deviceRef.current?.connect();
      else {
        axios.post("/webhook", {
          Called: "device",
          CallStatus: EVENT_SOURCE.CALL_EVENT.ERROR,
        });
        toast.current?.show({
          severity: "error",
          summary: "Ошибка связи с сервером",
          detail: "Перезагрузите страницу",
        });
      }
    });

    eventSource.addEventListener(EVENT_SOURCE.SYSTEM_EVENT.GET_DEVICE, () => {
      axios.post("/device-status", {
        isReady: isReady.current,
        deviceName: "caller",
      });
    });

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(
      "check is ready -> ",
      deviceRef.current,
      deviceStatus,
      mediaStatus,
      eventsStatus
    );
    if (
      deviceRef.current &&
      deviceStatus === CONNECT_STATUS.CONNECTED &&
      mediaStatus === CONNECT_STATUS.CONNECTED &&
      eventsStatus === CONNECT_STATUS.CONNECTED
    ) {
      isReady.current = true;
    } else isReady.current = false;
    axios.post("/device-status", {
      isReady: isReady.current,
      deviceName: "caller",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceStatus, mediaStatus, eventsStatus]);

  useEffect(() => {
    setMediaStatus(CONNECT_STATUS.REQUESTING);
    initMediaStream()
      .then(() => {
        setMediaStatus(CONNECT_STATUS.CONNECTED);
      })
      .catch(() => {
        setMediaStatus(CONNECT_STATUS.FAILED);
      });
  }, []);

  useEffect(() => {
    setTokenStatus(CONNECT_STATUS.REQUESTING);
    axios.get("/token").then(({ data }) => {
      setTokenStatus(CONNECT_STATUS.CONNECTED);
      setDeviceStatus(CONNECT_STATUS.REQUESTING);
      const device = new Device(data.token, {
        appName: "caller",
        // @ts-ignore
        codecPreferences: ["opus", "pcmu"],
        fakeLocalDTMF: true,
        enableRingingState: true,
      });
      device.on("ready", function () {
        console.log("ready -> ", device);

        deviceRef.current = device;
        setDeviceStatus(CONNECT_STATUS.CONNECTED);
      });
      device.on("error", function (error) {
        setIsInProgress(false);
        console.log("Twilio.Device Error: " + error.message);
        setDeviceStatus(CONNECT_STATUS.FAILED);
      });
      device.on("connect", function () {
        setIsInProgress(true);
        console.log("Successfully established call!");
        axios.post("/webhook", {
          Called: "device",
          CallStatus: EVENT_SOURCE.CALL_EVENT.IN_PROGRESS,
        });
      });
      device.on("disconnect", function () {
        setIsInProgress(false);
        console.log("Successfully disconnected call!");
      });
    });
  }, []);

  return (
    <div
      className="p-d-flex p-jc-center p-ai-start"
      style={{ backgroundColor: "var(--surface-a)", height: "100vh" }}
    >
      <CallInProgress visible={isInProgress} />
      <div
        className="p-d-flex p-jc-center p-col-6 p-nogutter p-flex-wrap"
        style={{
          minWidth: "400px",
          padding: "0 40px 40px",
          backgroundColor: "var(--surface-b)",
        }}
      >
        <Toast ref={toast} />
        <Card
          style={{ width: "20rem" }}
          subTitle="Системная страница для WebRTC соединений"
          title="WebRTC"
        >
          На вашу страницу будет загружен скрит, делающий возможным браузерные
          звонки
        </Card>
        <Card
          title="Статус"
          subTitle="Статус подключения"
          style={{ width: "20rem" }}
        >
          <div className="p-d-flex p-dir-col p-ai-start">
            <Status className="p-mb-1" status={mediaStatus} label="Микрофон" />
            <Status className="p-mb-1" status={tokenStatus} label="Токен" />
            <Status className="p-mb-1" status={eventsStatus} label="Сервер" />
            <Status
              className="p-mb-1"
              status={deviceStatus}
              label="Устройство"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
