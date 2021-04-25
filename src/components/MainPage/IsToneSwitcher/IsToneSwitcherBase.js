import { InputSwitch } from "primereact/inputswitch";
import { Skeleton } from "primereact/skeleton";
import React from "react";
import { STATUS } from "src/constants/app-constants";
import cn from "classnames";

export function IsToneSwitcherBase({
  status,
  isTone,
  setIsTone,
  className = null,
  style = null,
  ...props
}) {
  if (status === STATUS.SYSTEM.LOADING)
    return (
      <div
        style={{ ...style }}
        className={cn(className, "p-d-flex p-ai-center p-mt-3")}
      >
        <Skeleton
          borderRadius="16px"
          className="p-mr-3"
          height="28px"
          width="48px"
        />
        <Skeleton height="21px" width="315px" />
      </div>
    );

  return (
    <div
      style={{ ...style }}
      className={cn(className, "p-d-flex p-ai-center p-mt-3")}
    >
      <InputSwitch
        disabled={status === STATUS.SYSTEM.ERROR}
        checked={isTone}
        onChange={(e) => setIsTone(e.value)}
        className="p-mr-3"
        {...props}
      />
      <label
        style={{
          cursor: status !== STATUS.SYSTEM.ERROR && "pointer",
          color:
            status !== STATUS.SYSTEM.ERROR
              ? "var(--text-color)"
              : "var(--text-secondary-color)",
        }}
        onClick={(e) => {
          e.preventDefault();
          if (status === STATUS.SYSTEM.ERROR) return;

          setIsTone(!isTone);
        }}
      >
        Генерация тональной последовательности
      </label>
    </div>
  );
}
