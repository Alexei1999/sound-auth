import React from "react";
import { useContextStore } from "src/reducers/reducer";
import { DeviceIndicatorBase } from "./DeviceIndicatorBase";

export function DeviceIndicator() {
  const {
    status,
    form: { item },
    view: { isActive },
  } = useContextStore();
  return (
    <DeviceIndicatorBase
      isActive={isActive}
      item={item}
      status={status}
      style={{ maxWidth: "380px" }}
    />
  );
}
