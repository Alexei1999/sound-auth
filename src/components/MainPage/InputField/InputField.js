import React from "react";
import { actionCreators } from "src/reducers/actions";
import { useContextDispatch, useContextStore } from "src/reducers/reducer";

import { InputFieldBase } from "./InputFieldBase";

export function InputField({ onChange, value }) {
  const {
    status,
    form: { item },
    view: { isActive },
  } = useContextStore();
  const dispatch = useContextDispatch();

  return (
    <InputFieldBase
      style={{ maxWidth: "380px" }}
      isActive={isActive}
      value={value}
      onChange={(input) => {
        dispatch(actionCreators.setIsActive(false));
        onChange(input);
      }}
      status={status}
      item={item}
    />
  );
}
