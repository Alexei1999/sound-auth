import React from "react";
import { MenuThemeIcon } from "./MenuThemeIcon";
import cn from "classnames";

export function HeaderBase({ selectedKey, className = null, style = {} }) {
  return (
    <div
      style={{ maxWidth: "200px", minWidth: "160px" }}
      className={cn(className, "p-d-flex p-col-5 p-ai-center p-jc-between")}
    >
      <h1>Диплом</h1>
      <MenuThemeIcon selected={selectedKey} />
    </div>
  );
}
