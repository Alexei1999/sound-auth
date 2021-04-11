import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { BsFillMicFill } from "react-icons/bs";

export function RecordingDialog({ time }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => progress + 10);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, time / 10);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      closeOnEscape={false}
      closable={false}
      header="Подождите"
      footer={
        <ProgressBar
          // showValue={false}
          mode={progress >= 100 ? "indeterminate" : undefined}
          value={progress}
        />
      }
      visible={true}
      style={{ width: "50vw" }}
      baseZIndex={1000}
      onHide={() => {}}
    >
      <div className="p-d-flex p-ai-center">
        <BsFillMicFill size="20px" color="var(--primary-color)" />
        <p className="p-ml-3">Идет запись!</p>
      </div>
    </Dialog>
  );
}
