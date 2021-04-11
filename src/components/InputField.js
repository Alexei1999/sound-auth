import React from "react";
import { InputMask } from "primereact/inputmask";
import { STATUS } from "src/constants/app-constants";
import { Loader } from "./Loader";

export function InputField({ item, status, onChange, value }) {
  const isDisabled = status === STATUS.LOADING || status === STATUS.ERROR;

  if (!item) return <Loader style={{ width: "100px" }} />;

  return (
    <div className="p-fluid p-formgrid p-grid">
      <div className="p-field p-col-12">
        <label htmlFor={item.key}>Введите идентификатор</label>
        <span className="p-input-icon-right">
          {status === STATUS.LOADING && <i className="pi pi-spin pi-spinner" />}
          <InputMask
            disabled={isDisabled}
            id={item.key}
            mask={item.mask}
            value={value}
            placeholder={item.placeholder}
            onChange={(e) => onChange(e.value)}
          />
        </span>
      </div>
    </div>
  );
}
