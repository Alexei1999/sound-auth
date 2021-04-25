import React from "react";
import { RadioGroup } from "src/components/shared/RadioGroup";
import { actionCreators } from "src/reducers/actions";
import { useContextApp } from "src/reducers/reducer";

export function SelectKey() {
  const [state, dispatch] = useContextApp();
  const {
    status,
    form: { selectedKey, methods },
  } = state;

  return (
    <RadioGroup
      status={status}
      selected={selectedKey}
      setSelected={(key) => dispatch(actionCreators.selectItemByKey(key))}
      items={methods && Object.values(methods)}
    />
  );
}
