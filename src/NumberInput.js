import React from "react";
import { useState } from "react";
import { InputMask } from "primereact/inputmask";

export default function NumberInput() {
  const [val, setVal] = useState();

  return (
    <div className="p-field p-col-12 p-md-4">
      <label htmlFor="phone">Введите номер телефона</label>
      <InputMask
        id="phone"
        mask="+(999) 999-9999"
        value={val}
        placeholder="+(375) 99 999-9999"
        onChange={(e) => setVal(e.value)}
      ></InputMask>
    </div>
  );
}
