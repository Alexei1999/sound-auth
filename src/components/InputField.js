import React from "react";
import { InputMask } from "primereact/inputmask";
import { STATUS } from "src/constants/app-constants";
import { Skeleton } from "primereact/skeleton";
import cn from "classnames";

export function InputField({
  isActive,
  item,
  status,
  onChange,
  value,
  className = null,
  style = null,
  ...props
}) {
  const isDisabled =
    status === STATUS.SYSTEM.LOADING || status === STATUS.SYSTEM.ERROR;

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

  if (!item)
    return (
      <div
        style={{ ...style }}
        className={cn(className, "p-fluid p-formgrid p-grid")}
      >
        <div className="p-field p-col-12">
          <label>Введите идентификатор</label>
          <span className="p-input-icon-right">
            <i className="pi pi-spin pi-spinner" />
            <InputMask mask="" disabled />
          </span>
        </div>
      </div>
    );

  return (
    <div
      style={{ ...style }}
      className={cn(className, "p-fluid p-formgrid p-grid")}
    >
      <div className="p-field p-d-flex p-flex-column p-col-12">
        <label htmlFor={item.key}>Введите идентификатор</label>
        <InputMask
          className={cn(isActive && "p-invalid")}
          disabled={isDisabled}
          id={item.key}
          mask={item.mask}
          value={value}
          placeholder={item.placeholder}
          onChange={(e) => onChange(e.value)}
          aria-describedby={item.key}
          {...props}
        />
        {isActive && (
          <small id={item.key} className="p-error p-d-block">
            Проверьте корректность ввода!
          </small>
        )}
      </div>
    </div>
  );
}
