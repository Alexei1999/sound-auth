import React from "react";
import { useContextStore } from "src/reducers/reducer";
import { HeaderBase } from "./HeaderBase";

export function Header() {
  const {
    form: { selectedKey },
  } = useContextStore();
  return (
    <HeaderBase
      style={{ maxWidth: "200px", minWidth: "160px" }}
      selectedKey={selectedKey}
    />
  );
}
