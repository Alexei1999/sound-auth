import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { RECORDING_TIME, STATUS, TYPES } from "src/constants/app-constants";
import { MEDIA_STREAM } from "src/constants/user-media";
import { IncomingCallDialog } from "src/components/MainPage/Dialog/IncomingCallDialog";
import { initMediaStream } from "src/utils/functionalUtils";
import { validate } from "src/services/validationServices";
import { getMethodsService } from "src/services/getMethodsService";
import { actionCreators } from "../reducers/actions";
import { MainPageContainer } from "src/components/MainPage/MainPageContainer/MainPageContainer";
import { Header } from "src/components/MainPage/Header";
import { InputField } from "src/components/MainPage/InputField/InputField";
import { DeviceIndicator } from "src/components/MainPage/DeviceIndicator/DeviceIndicator";
import { IsToneSwitcher } from "src/components/MainPage/IsToneSwitcher/index";
import { SelectExtraKey } from "src/components/MainPage/RadioGroup/SelectExtraKey";
import { FooterButtons } from "src/components/MainPage/FooterButtons";
import { RecordingDialog } from "src/components/MainPage/Dialog/RecordingDialog";
import { SelectKey } from "src/components/MainPage/RadioGroup/SelectKey";
import { useContextApp } from "src/reducers/reducer";
import { useToast } from "src/components/shared/ToastProvider";

export function MainPage() {
  const [state, dispatch] = useContextApp();

  const buttonCallback = useRef(null);

  const { toastWarn, toastError } = useToast();

  const {
    status,
    devices: { microphone, microphoneError, server },
    form: { isTone, selectedKey, selectedExtraKey, methods },
    view: { type },
    toastRef,
  } = state;

  const [input, setInput] = useState();

  useEffect(() => {
    buttonCallback.current?.();
  }, [toastRef]);

  useEffect(() => {
    if (type === TYPES.INPUT) buttonCallback.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods]);

  useEffect(() => {
    if (type !== TYPES.INDICATOR) return;

    axios("/device-status").catch((e) => {
      dispatch(actionCreators.setStatus(STATUS.SYSTEM.ERROR));
    });
    dispatch(actionCreators.setIsActive(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (status === STATUS.READY) {
      buttonCallback.current?.();
    }
  }, [status]);

  useEffect(() => {
    getMethodsService()
      .then((data) => {
        console.log("set methods -> ", methods);
        dispatch(actionCreators.setMethods(data));
      })
      .catch((e) => {
        console.error(e);
        dispatch(actionCreators.setServerStatus(false));
        toastError(
          "Ошибка запроса на сервер",
          "Нет связи с сервером, обновите страницу"
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initMediaStream()
      .then(() => {
        dispatch(actionCreators.setMicrophoneStatus(true));
      })
      .catch((error) => {
        dispatch(actionCreators.setMicrophoneStatus(false, error.name));
        switch (error.name) {
          case MEDIA_STREAM.ERROR.NOT_ALLOWED:
            toastWarn("Ошибка доступа", "Предоставьте доступ к микрофону");
            break;
          case MEDIA_STREAM.ERROR.NOT_FOUND:
            toastError("Ошибка", "Микрофон не обнаружен");
            break;
          default:
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (server === false || microphoneError === MEDIA_STREAM.ERROR.NOT_FOUND)
      return dispatch(actionCreators.setStatus(STATUS.SYSTEM.ERROR));
    if (microphoneError === MEDIA_STREAM.ERROR.NOT_ALLOWED)
      return dispatch(actionCreators.setStatus(STATUS.IDLE));
    if (server === true && microphone === true && methods) {
      return dispatch(actionCreators.setStatus(STATUS.READY));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphone, server, methods]);

  const onClickHandler = async () => {
    dispatch(actionCreators.setIsSpinner(true));

    if (!validate(selectedKey, input, methods?.[selectedKey])) {
      dispatch(actionCreators.setIsActive(true));
      dispatch(actionCreators.setIsSpinner(false));
      buttonCallback.current?.();
      return;
    }

    console.log(methods?.[selectedKey]?.type, methods?.[selectedKey]);

    axios.post(
      "/auth",
      {
        key: selectedKey,
        extraKey: selectedExtraKey,
        isTone,
        id:
          methods?.[selectedKey]?.type === TYPES.INPUT
            ? // @ts-ignore
              input?.replace(/[^\d+]/g, "")
            : methods?.[selectedKey]?.type === TYPES.INDICATOR
            ? methods?.[selectedKey]?.deviceName
            : null,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
  };

  return (
    <MainPageContainer>
      <Header />
      <IncomingCallDialog visible={status === STATUS.CALL.RINGING} />
      <RecordingDialog
        visible={status === STATUS.CALL.IN_PROGRESS}
        time={RECORDING_TIME}
      />
      {(type === TYPES.INPUT || !type) && (
        <InputField value={input} onChange={setInput} />
      )}
      {type === TYPES.INDICATOR && <DeviceIndicator />}
      <div className="p-grid p-nogutter p-mt-1 p-ml-2">
        <SelectKey />
        <SelectExtraKey className="p-ml-6" />
      </div>
      <IsToneSwitcher />
      <FooterButtons
        onClickHandler={onClickHandler}
        buttonCallback={buttonCallback}
        toastWarn={toastWarn}
      />
    </MainPageContainer>
  );
}

export default MainPage;
