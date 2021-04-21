// @ts-ignore
import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import axios from "axios";
const { Device } = require("twilio-client");

const WEB_RTC = {
  CONNECTED: "CONNECTED",
  REQUESTING: "REQUESTING",
  FAILED: "FAILED",
  IDLE: "IDLE",
};

// @ts-ignore
function Status({ status, label }) {
  return status === WEB_RTC.REQUESTING ? (
    <Tag severity="info" value={label} icon="pi pi-spin pi-spinner" />
  ) : status === WEB_RTC.CONNECTED ? (
    <Tag severity="success" value={label} icon="pi pi-check" />
  ) : status === WEB_RTC.FAILED ? (
    <Tag severity="danger" value={label} icon="pi pi-times" />
  ) : (
    <Tag value={label} icon="pi pi-circle-off" />
  );
}

export function ReceiveCallPage() {
  const [deviceStatus, setDeviceStatus] = useState(WEB_RTC.IDLE);
  const [tokenStatus, setTokenStatus] = useState(WEB_RTC.IDLE);

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
      device.on("ready", function (device) {
        setDeviceStatus(WEB_RTC.CONNECTED);
      });
      device.on("error", function (error) {
        console.log("Twilio.Device Error: " + error.message);
        setDeviceStatus(WEB_RTC.FAILED);
      });
      var params = { phoneNumber: "+375336864076" };
      device.connect(params);
    });
  }, []);

  return (
    <div
      className="p-d-flex p-jc-center p-ai-start"
      style={{ backgroundColor: "var(--surface-a)", height: "100vh" }}
    >
      <div
        className="p-d-flex p-jc-center p-col-6 p-nogutter"
        style={{
          minWidth: "400px",
          padding: "0 40px 40px",
          backgroundColor: "var(--surface-b)",
        }}
      >
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
            <Status status={tokenStatus} label="Токен" />
            <Status status={deviceStatus} label="Устройство" />
          </div>
        </Card>
      </div>
    </div>
  );
}
