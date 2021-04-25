import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { BsFillMicFill } from "react-icons/bs";
import axios from "axios";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

export function RecordingDialog({ time, visible }) {
  const [progress, setProgress] = useState(0);
  const [recordState, setRecordState] = useState(RecordState.NONE);

  useEffect(() => {
    if (!visible && progress !== 0) {
      setProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (visible && recordState !== RecordState.START)
      setTimeout(() => {
        setRecordState(RecordState.START);
      });

    if (!visible && recordState === RecordState.START)
      setRecordState(RecordState.STOP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTimeout(() => {
        setProgress((progress) => progress + 10);
      });
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, time / 10);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const stopRecordingHandler = (file) => {
    const formData = new FormData();
    formData.append("file", file.blob, "audio.wav");

    axios.post("/verification", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProgress(0);
  };

  return (
    <>
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
        visible={visible}
        style={{ width: "50vw" }}
        baseZIndex={1000}
        onHide={() => {}}
      >
        <div className="p-d-flex p-ai-center">
          <BsFillMicFill size="20px" color="var(--primary-color)" />
          <p className="p-ml-3">Идет запись!</p>
        </div>
      </Dialog>
      <Dialog
        closeOnEscape={false}
        closable={false}
        baseZIndex={1001}
        position="bottom-right"
        visible={visible}
        onHide={() => {}}
        modal={false}
      >
        {/* @ts-ignore */}
        <AudioReactRecorder
          backgroundColor="white"
          canvasWidth={window.innerWidth * 0.2 - 50}
          canvasHeight="175"
          state={recordState}
          onStop={stopRecordingHandler}
        />
      </Dialog>
    </>
  );
}
