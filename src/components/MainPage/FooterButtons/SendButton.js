import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import { STATUS } from "src/constants/app-constants";
import cn from "classnames";
import { ProgressSpinner } from "primereact/progressspinner";

export function SendButton({
  status,
  className = null,
  onClick,
  stopLoader,
  isSpinner = false,
  disabled = false,
  ...props
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    stopLoader.current = () => {
      setLoading(false);
    };
    return () => {
      stopLoader.current = null;
    };
  }, [stopLoader, setLoading]);

  useEffect(() => {
    setLoading(false);
  }, [status]);

  if (isSpinner)
    return <ProgressSpinner style={{ width: "40px", height: "40px" }} />;

  if (status === STATUS.SYSTEM.LOADING)
    return <Skeleton className={className} height="40px" width="125px" />;

  return (
    <Button
      disabled={disabled || loading || status === STATUS.SYSTEM.ERROR}
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
