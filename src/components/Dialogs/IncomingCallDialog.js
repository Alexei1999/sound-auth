import React from "react";
import { Dialog } from "primereact/dialog";
import { AiOutlinePhone } from "react-icons/ai";

export function IncomingCallDialog() {
  return (
    <Dialog
      closeOnEscape={false}
      closable={false}
      header="Примите входящий вызов"
      visible={true}
      style={{ width: "20vw" }}
      baseZIndex={1000}
      onHide={() => {}}
    >
      <div className="p-d-flex p-ai-center">
        <p className="">Вам звонят!</p>
        <AiOutlinePhone
          size="35px"
          color="var(--primary-color)"
          className="p-ml-3 is-ringing"
        />
      </div>
    </Dialog>
  );
}
