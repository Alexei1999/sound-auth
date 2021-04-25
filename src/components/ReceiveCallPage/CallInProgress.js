import React from "react";
import { Dialog } from "primereact/dialog";
import { VscCallIncoming } from "react-icons/vsc";
import { ProgressBar } from "primereact/progressbar";

export function CallInProgress({ visible }) {
  return (
    <Dialog
      closeOnEscape={false}
      closable={false}
      header="Входящий вызов"
      visible={visible}
      style={{ minWidth: "300px", width: "30vw" }}
      baseZIndex={1000}
      footer={<ProgressBar mode="indeterminate" />}
      onHide={() => {}}
    >
      <div className="p-d-flex p-ai-center">
        <VscCallIncoming size="35px" color="var(--primary-color)" />
        <p className="p-ml-3">Принимается входящий вызов</p>
      </div>
    </Dialog>
  );
}
