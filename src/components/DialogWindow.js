import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";

export function DialogWindow() {
  const [displayBasic, setDisplayBasic] = useState(true);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Dialog
      closeOnEscape={false}
      closable={false}
      header="Подождите"
      footer={<ProgressBar mode="indeterminate" value={30}></ProgressBar>}
      visible={displayBasic}
      style={{ width: "50vw" }}
      onHide={() => setDisplayBasic(false)}
      baseZIndex={1000}
    >
      <p>Пожалуйста, подождите!</p>
    </Dialog>
  );
}
