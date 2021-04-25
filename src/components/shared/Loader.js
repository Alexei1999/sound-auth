import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

export function Loader(props) {
  return (
    <div className="p-field p-col-12">
      <div className="card">
        <ProgressSpinner {...props} />
      </div>
    </div>
  );
}
