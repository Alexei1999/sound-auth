import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import { STATUS } from "src/constants/app-constants";
import cn from "classnames";

export function SendButton({ status, className = null, onClick, ...props }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [status]);

  if (status === STATUS.SYSTEM.LOADING)
    return <Skeleton className={className} height="40px" width="125px" />;

  return (
    <Button
      disabled={loading || status === STATUS.SYSTEM.ERROR}
      label="Регистрация"
      className={cn("p-button ", className)}
      onClick={() => {
        setLoading(true);
        onClick();
      }}
      {...props}
    />
  );
}
