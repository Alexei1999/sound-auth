import React from "react";
import { STATUS } from "src/constants/app-constants";
import { Skeleton } from "primereact/skeleton";
import cn from "classnames";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

export function DeviceIndicatorBase({
  item = {},
  status,
  isActive,
  className = null,
  style = null,
}) {
  if (status === STATUS.SYSTEM.LOADING)
    return (
      <div
        style={{ ...style }}
        className={cn(className, "p-fluid p-formgrid p-grid")}
      >
        <div className="p-field p-col-12">
          <Skeleton className="p-mb-2" height="21px" width="180px" />
          <Skeleton height="40px" />
        </div>
      </div>
    );
  // @ts-ignore
  const { deviceStatus, deviceName } = item;

  const severity =
    deviceStatus === STATUS.RESULT.SUCCESS
      ? "success"
      : deviceStatus === STATUS.RESULT.FAILRUE
      ? "danger"
      : null;

  return (
    <div
      style={{ ...style }}
      className={cn(className, "p-fluid p-formgrid p-grid")}
    >
      <div className="p-field p-d-flex p-flex-column p-col-12">
        <label>Подключенное устройство</label>
        <Button
          type="button"
          disabled={status === STATUS.SYSTEM.ERROR}
          label={
            deviceName ||
            (!severity ? "Устройство не подключено" : "Устройство не опознано")
          }
          icon={!severity ? "pi pi-spin pi-spinner" : "pi pi-mobile"}
          className={cn(isActive && "p-button-outlined p-button-danger")}
        >
          <Badge severity={severity}></Badge>
        </Button>
      </div>
    </div>
  );
}
