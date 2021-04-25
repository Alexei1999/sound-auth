import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import React, { useState } from "react";
import { STATUS } from "src/constants/app-constants";
import cn from "classnames";

export function StatusButton({
  status,
  className = undefined,
  onClick,
  ...props
}) {
  const [loading, setLoading] = useState(false);

  if (status === STATUS.SYSTEM.LOADING)
    return <Skeleton className={className} height="40px" width="80px" />;

  const onClickHandler = () => onClick(setLoading);

  return (
    <Button
      disabled={loading || status === STATUS.SYSTEM.ERROR}
      height="40px"
      width="80px"
      label="Статус"
      className={cn("p-button-secondary", className)}
      onClick={onClickHandler}
      {...props}
    />
  );
}
