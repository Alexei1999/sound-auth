import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { BsFillMicFill } from "react-icons/bs";
import axios from "axios";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { useScreenSize } from "src/hooks/useScreenWidth";
import { initMediaStream } from "src/utils/functionalUtils";
import { useContextDispatch } from "src/reducers/reducer";
import { actionCreators } from "src/reducers/actions";
import { ProgressSpinner } from "primereact/progressspinner";
import { ErrorBoundary } from "src/components/shared/ErrorBoundary";

export function RecordingDialog({ time, visible }) {
  const [progress, setProgress] = useState(0);
  const [recordState, setRecordState] = useState(RecordState.NONE);
  const [isMic, setIsMic] = useState(false);
  const [isMicError, setIsMicError] = useState(false);

  const dispatch = useContextDispatch();

  const [width] = useScreenSize();
  const isMobile = width < 400;
  const isLaptop = !isMobile && width < 800;

  useEffect(() => {
    if (!visible && isMicError)
      dispatch(actionCreators.setMicrophoneStatus(true, isMicError));
    initMediaStream()
      .then(() => setIsMic(true))
      .catch((error) => {
        setIsMic(false);
        setIsMicError(error.name);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible && progress !== 0) {
      setProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (visible && isMic && recordState !== RecordState.START)
      setTimeout(() => {
        setRecordState(RecordState.START);
      });

    if (!visible && recordState === RecordState.START) {
      setRecordState(RecordState.STOP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isMic]);

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
    setIsMic(false);
  };

  useEffect(() => {
    if (recordState !== RecordState.START) return;

    const formData = new FormData();
    formData.append("audio", "true");
    formData.append("chunk", new Blob(["mock"]));
    const interval = setInterval(() => {
      axios
        .post("/add-chunk", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .catch(() => {});
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [recordState]);

  const micModal = useRef(null);

  return (
    <>
      <Dialog
        position={isLaptop ? "left" : isMobile ? "top" : undefined}
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
        style={{
          minWidth: "200px",
          width: isLaptop ? "50vw" : isMobile ? "100vw" : "50vw",
        }}
        baseZIndex={1000}
        onHide={() => {}}
      >
        <div className="p-d-flex p-ai-center">
          <BsFillMicFill size="20px" color="var(--primary-color)" />
          <p className="p-ml-3">Идет запись!</p>
        </div>
      </Dialog>
      <Dialog
        ref={micModal}
        closeOnEscape={false}
        closable={false}
        baseZIndex={1001}
        position={!isLaptop && isMobile ? "bottom" : "bottom-right"}
        visible={visible}
        onHide={() => {}}
        modal={false}
        style={{
          minWidth: "200px",
          width: isLaptop ? "50vw" : isMobile ? "100vw" : "20vw",
          height: isLaptop ? "100vh" : isMobile ? "50vh" : "20vh",
          minHeight: "110px",
        }}
      >
        {isMicError ? (
          <div>
            <span
              className="pi pi-times"
              style={{ color: "var(--primary-color)" }}
            />{" "}
            Проблема с получением контекста микрофона{" "}
          </div>
        ) : isMic ? (
          <ErrorBoundary>
            {/* @ts-ignore */}
            <AudioReactRecorder
              backgroundColor="white"
              canvasWidth={micModal.current?.contentEl?.clientWidth - 50 || 0}
              canvasHeight={micModal.current?.dialogEl?.clientHeight - 84 || 0}
              state={recordState}
              onStop={stopRecordingHandler}
            />
          </ErrorBoundary>
        ) : (
          <ProgressSpinner style={{ width: "100%", height: "100%" }} />
        )}
      </Dialog>
    </>
  );
}
