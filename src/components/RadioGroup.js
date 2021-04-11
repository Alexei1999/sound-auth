import React from "react";
import { RadioButton } from "primereact/radiobutton";
import { Loader } from "./Loader";
import { Skeleton } from "primereact/skeleton";

export function RadioGroup({
  items,
  selected,
  setSelected,
  isSkeleton = false,
}) {
  if (isSkeleton)
    return (
      <>
        {Array(2)
          .fill()
          .map(() => (
            <div className="p-d-flex p-ai-center p-mb-3">
              <Skeleton shape="circle" height="20px" width="20px" />
              <Skeleton className="p-ml-2" height="15px" width="120px" />
            </div>
          ))}
      </>
    );

  if (!items || !items.length) return <Loader style={{ width: "50px" }} />;

  if (!selected) setSelected(items[0].key);

  return (
    <div className="card">
      {items.map((item) => {
        return (
          <div key={item.key} className="p-field-radiobutton">
            <RadioButton
              inputId={item.key}
              name={item.key}
              value={item.key}
              onChange={(e) => setSelected(e.value)}
              checked={selected === item.key}
            />
            <label htmlFor={item.key}>{item.name}</label>
          </div>
        );
      })}
    </div>
  );
}
