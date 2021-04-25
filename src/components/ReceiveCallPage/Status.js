import React from "react";
import { Tag } from "primereact/tag";

export const CONNECT_STATUS = {
  CONNECTED: "CONNECTED",
  REQUESTING: "REQUESTING",
  FAILED: "FAILED",
  IDLE: "IDLE",
};

export function Status({ status, label, ...props }) {
  return status === CONNECT_STATUS.REQUESTING ? (
    <Tag
      severity="info"
      value={label}
      {...props}
      icon="pi pi-spin pi-spinner"
    />
  ) : status === CONNECT_STATUS.CONNECTED ? (
    <Tag severity="success" value={label} {...props} icon="pi pi-check" />
  ) : status === CONNECT_STATUS.FAILED ? (
    <Tag severity="danger" value={label} {...props} icon="pi pi-times" />
  ) : (
    <Tag value={label} {...props} icon="pi pi-circle-off" />
  );
}
