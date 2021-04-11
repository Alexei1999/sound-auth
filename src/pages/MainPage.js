import React, { useEffect, useRef, useState } from "react";

import { RadioGroup } from "src/components/RadioGroup";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { EVENT_SOURCE, MEDIA_STREAM } from "src/constants/user-media";
import {
  getMediaStreamError,
  toastMediaStreamError,
} from "src/utils/functionalUtils";
import { STATUS } from "src/constants/app-constants";
import axios from "axios";
import { InputField } from "src/components/InputField";
import { RecordingDialog } from "src/components/Dialogs/RecordingDialog";
import { InputSwitch } from "primereact/inputswitch";
import { CSSTransition } from "react-transition-group";

export function MainPage() {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [methods, setMethods] = useState(null);
  const [isTone, setIsTone] = useState(true);
  const [devicesStatus, setDevicesStatus] = useState({
    microphone: null,
    server: null,
  });
  const [input, setInput] = useState();
  const [showExtra, setShowExtra] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedExtraKey, setSelectedExtraKey] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    // console.log("status -> ", status);
  }, [status]);

  useEffect(() => {
    axios
      .get("/methods")
      .then(({ data }) => {
        setMethods(
          // eslint-disable-next-line no-sequences
          data.reduce((obj, method) => ((obj[method?.key] = method), obj), {})
        );
      })
      .catch((e) => {
        console.error(e);
        setDevicesStatus((status) => ({ ...status, server: false }));
        toast.current?.show({
          severity: "error",
          summary: "Ошибка запроса на сервер",
          detail: "Нет связи с сервером, обновите страницу",
          life: "<frontend port>",
        });
      });
  }, []);

  useEffect(() => {
    (async () => {
      const error = await getMediaStreamError();
      if (error) {
        setDevicesStatus((status) => ({ ...status, microphone: error }));
        toastMediaStreamError(error);
      } else {
        setDevicesStatus((status) => ({ ...status, microphone: true }));
      }
    })();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/emitter");

    eventSource.onerror = () => {
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Нет связи с сервером, обновите страницу",
        life: "<frontend port>",
      });

      setDevicesStatus((status) => ({ ...status, server: false }));
    };
    eventSource.onopen = () => {
      setDevicesStatus((status) => ({ ...status, server: true }));
    };

    // eventSource.onmessage = (e) => console.log("mesage", e);

    eventSource.addEventListener(EVENT_SOURCE.CALL_EVENT.RINGING, () => {});
    eventSource.addEventListener(EVENT_SOURCE.SYSTEM_EVENT.ON_ERROR, () => {});

    return () => {};
  }, []);

  useEffect(() => {
    const {
      server: serverStatus,
      microphone: microphoneStatus,
    } = devicesStatus;

    if (
      serverStatus === false ||
      microphoneStatus === MEDIA_STREAM.ERROR.NOT_FOUND
    )
      return setStatus(STATUS.ERROR);
    if (microphoneStatus === MEDIA_STREAM.ERROR.NOT_ALLOWED)
      return setStatus(STATUS.IDLE);
    if (serverStatus === true && microphoneStatus === true && methods)
      return setStatus(STATUS.READY);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesStatus.microphone, devicesStatus.server, methods]);

  const onClickHandler = async () => {
    if (!toastMediaStreamError()) return;
  };

  const isExtra = methods && methods[selectedKey]?.extra;

  return (
    <div className="p-d-flex p-jc-center">
      <div className="p-md-4">
        <h1>Диплом</h1>
        <Toast ref={toast} />
        <RecordingDialog />
        <InputField
          value={input}
          onChange={setInput}
          status={status}
          item={methods?.[selectedKey]}
        />
        <div className="p-grid p-nogutter p-mt-1 p-ml-2">
          <RadioGroup
            selected={selectedKey}
            setSelected={setSelectedKey}
            items={methods && Object.values(methods)}
          />
          <div className="p-ml-6">
            <CSSTransition
              classNames="extra"
              in={isExtra}
              timeout={300}
              unmountOnExit
              onEntered={() => setShowExtra(true)}
              onExiting={() => setShowExtra(false)}
            >
              <div>
                <RadioGroup
                  isSkeleton={!showExtra}
                  selected={selectedExtraKey}
                  setSelected={setSelectedExtraKey}
                  items={methods?.[selectedKey]?.extra}
                />
              </div>
            </CSSTransition>
          </div>
        </div>
        <div className="p-d-flex p-ai-center p-mt-3">
          <InputSwitch
            disabled={status === STATUS.ERROR}
            checked={isTone}
            onChange={(e) => setIsTone(e.value)}
            className="p-mr-3"
          />
          <label
            onClick={(e) => {
              setIsTone((value) => !value);
              e.preventDefault();
            }}
          >
            Генерация тональной последовательности
          </label>
        </div>
        <Button
          icon={status === STATUS.LOADING ? "pi pi-spin pi-spinner" : undefined}
          disabled={status === STATUS.ERROR}
          label="Регистрация"
          className="p-button p-mt-5"
          onClick={onClickHandler}
        />
      </div>
    </div>
  );
}

export default MainPage;
