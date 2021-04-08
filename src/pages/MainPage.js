import React, { useEffect, useRef, useState } from "react";

import { RadioGroup } from "src/components/RadioGroup";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { EVENT_SOURCE, MEDIA_STREAM } from "src/constants/user-media";
import {
  getMediaStreamError,
  toastMediaStreamError,
} from "src/utils/functionalUtils";
import { STATUS } from "src/constants/statuses";
import { InputMask } from "primereact/inputmask";

export function MainPage() {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [devicesStatus, setDevicesStatus] = useState({
    microphone: null,
    server: null,
  });
  const [val, setVal] = useState();
  const toast = useRef(null);

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
    const eventSource = new EventSource(`${window.location.origin}/emitter`);

    eventSource.onerror = () => {
      toast.current.show({
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

    eventSource.onmessage = (e) => console.log("mesage", e);

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
    if (serverStatus === true && microphoneStatus === true)
      return setStatus(STATUS.READY);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesStatus.microphone, devicesStatus.server]);

  const onClickHandler = async () => {
    if (!toastMediaStreamError()) return;
  };

  return (
    <div className="p-d-flex p-jc-center">
      <div className="p-md-4">
        <h1>Диплом</h1>
        <Toast ref={toast} />
        {/* <DialogWindow /> */}
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
            <label htmlFor="phone">Введите номер телефона</label>
            <InputMask
              disabled={status === STATUS.LOADING || status === STATUS.ERROR}
              id="phone"
              mask="+999 (99) 999-99-99"
              value={val}
              placeholder="+XXX (XX) XXX-XX-XX"
              onChange={(e) => setVal(e.value)}
            ></InputMask>
          </div>
        </div>
        <RadioGroup
          items={[
            { name: "Звонок", key: "A" },
            { name: "IP-телефония", key: "B" },
          ]}
        />
        <Button
          icon={status === STATUS.LOADING && "pi pi-spin pi-spinner"}
          disabled={status === STATUS.ERROR}
          label="Регистрация"
          className="p-button"
          onClick={onClickHandler}
        />
      </div>
    </div>
  );
}

export default MainPage;
