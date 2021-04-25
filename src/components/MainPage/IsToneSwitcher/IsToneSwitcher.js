import React from "react";
import { actionCreators } from "src/reducers/actions";
import { useContextApp } from "src/reducers/reducer";
import { IsToneSwitcherBase } from "./IsToneSwitcherBase";

export function IsToneSwitcher() {
  const [state, dispatch] = useContextApp();
  const {
    status,
    form: { isTone },
  } = state;

  return (
    <IsToneSwitcherBase
      style={{ minWidth: "370px" }}
      status={status}
      isTone={isTone}
      setIsTone={(value) => dispatch(actionCreators.setIsTone(value))}
    />
  );
}
