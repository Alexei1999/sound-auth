import React, { useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Skeleton } from "primereact/skeleton";
import { STATUS } from "src/constants/app-constants";

export function RadioGroup({
  status,
  items,
  selected,
  setSelected,
  isSkeleton = false,
}) {
  const isItems = items && items.length;

  useEffect(() => {
    if (isItems && !selected) setSelected(items[0].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isItems, selected]);

  if (!isItems || isSkeleton)
    return (
      <div>
        {Array(4)
          .fill()
          .map((_, i) => (
            <div key={i} className="p-d-flex p-ai-center p-mb-3">
              <Skeleton shape="circle" height="20px" width="20px" />
              <Skeleton className="p-ml-2" height="15px" width="120px" />
            </div>
          ))}
      </div>
    );

  return (
    <div className="card">
      {items.map((item) => {
        return (
          <div key={item.key} className="p-field-radiobutton">
            <RadioButton
              disabled={status === STATUS.SYSTEM.ERROR}
              inputId={item.key}
              name={item.key}
              value={item.key}
              onChange={(e) => setSelected(e.value)}
              checked={selected === item.key}
            />
            <label style={{ cursor: "pointer" }} htmlFor={item.key}>
              {item.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
