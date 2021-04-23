import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import axios from "axios";
import { initMediaStream } from "src/utils/functionalUtils";
import { EVENT_SOURCE } from "src/constants/user-media";
import { Toast } from "primereact/toast";
import { CallInProgress } from "src/components/Dialogs/CallInProgress";
const { Device } = require("twilio-client");
const cn = require("classnames");

const WEB_RTC = {
  CONNECTED: "CONNECTED",
  REQUESTING: "REQUESTING",
  FAILED: "FAILED",
  IDLE: "IDLE",
};

const CALL_STATUS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
};

function Status({ status, label, ...props }) {
  return status === WEB_RTC.REQUESTING ? (
    <Tag
      severity="info"
      value={label}
      {...props}
      icon="pi pi-spin pi-spinner"
    />
  ) : status === WEB_RTC.CONNECTED ? (
    <Tag severity="success" value={label} {...props} icon="pi pi-check" />
  ) : status === WEB_RTC.FAILED ? (
    <Tag severity="danger" value={label} {...props} icon="pi pi-times" />
  ) : (
    <Tag value={label} {...props} icon="pi pi-circle-off" />
  );
}

export function ReceiveCallPage() {
  const [deviceStatus, setDeviceStatus] = useState(WEB_RTC.IDLE);
  const [tokenStatus, setTokenStatus] = useState(WEB_RTC.IDLE);
  const [mediaStatus, setMediaStatus] = useState(WEB_RTC.IDLE);
  const [eventsStatus, setEventsStatus] = useState(WEB_RTC.IDLE);
  const [isRinged, setIsRinged] = useState(false);
  const [device, setDevice] = useState(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [isCriticalShowed, setIsCriticialShowed] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    if (
      !isCriticalShowed &&
      [deviceStatus, tokenStatus, mediaStatus, eventsStatus].some(
        (status) => status === WEB_RTC.FAILED
      )
    ) {
      toast.current?.show({
        sticky: true,
        closable: false,
        severity: "error",
        summary: "Ошибка связи с сервером",
        detail: "Перезагрузите страницу",
      });
      setIsCriticialShowed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceStatus, tokenStatus, mediaStatus, eventsStatus]);

  useEffect(() => {
    setEventsStatus(WEB_RTC.REQUESTING);
    const eventSource = new EventSource("/emitter");

    eventSource.onerror = () => {
      setEventsStatus(WEB_RTC.FAILED);
      console.log("error");
    };
    eventSource.onopen = () => {
      setEventsStatus(WEB_RTC.CONNECTED);
      console.log("open");
    };
    eventSource.onmessage = (e) => {
      console.log("message");
    };

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !isRinged &&
      device &&
      deviceStatus === WEB_RTC.CONNECTED &&
      mediaStatus === WEB_RTC.CONNECTED
    ) {
      device.connect();
      // axios.post('/webhook', )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRinged, deviceStatus, mediaStatus, device]);

  useEffect(() => {
    setMediaStatus(WEB_RTC.REQUESTING);
    initMediaStream()
      .then(() => {
        setMediaStatus(WEB_RTC.CONNECTED);
      })
      .catch(() => {
        setMediaStatus(WEB_RTC.FAILED);
      });
  }, []);

  useEffect(() => {
    setTokenStatus(WEB_RTC.REQUESTING);
    axios.get("/token").then(({ data }) => {
      setTokenStatus(WEB_RTC.CONNECTED);
      setDeviceStatus(WEB_RTC.REQUESTING);
      const device = new Device(data.token, {
        // @ts-ignore
        codecPreferences: ["opus", "pcmu"],
        fakeLocalDTMF: true,
        enableRingingState: true,
      });
      device.on("ready", function () {
        setDeviceStatus(WEB_RTC.CONNECTED);
        setDevice(device);
      });
      device.on("error", function (error) {
        setIsInProgress(false);
        console.log("Twilio.Device Error: " + error.message);
        setDeviceStatus(WEB_RTC.FAILED);
      });
      device.on("connect", function () {
        setIsInProgress(true);
        console.log("Successfully established call!");
      });
      device.on("disconnect", function () {
        setIsInProgress(false);
        setIsRinged(true);
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
