import React from "react";
import { InputMask } from "primereact/inputmask";
import { STATUS } from "src/constants/app-constants";
import { Skeleton } from "primereact/skeleton";

export function InputField({ item, status, onChange, value }) {
  const isDisabled =
    status === STATUS.SYSTEM.LOADING || status === STATUS.SYSTEM.ERROR;

  if (status === STATUS.SYSTEM.LOADING)
    return (
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-12">
          <Skeleton className="p-mb-2" height="21px" width="180px" />
          <Skeleton height="40px" />
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="p-fluid p-formgrid p-grid">
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
    <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col-12">
        <label htmlFor={item.key}>Введите идентификатор</label>
        <InputMask
          disabled={isDisabled}
          id={item.key}
          mask={item.mask}
          value={value}
          placeholder={item.placeholder}
          onChange={(e) => onChange(e.value)}
        />
      </div>
    </div>
  );
}
