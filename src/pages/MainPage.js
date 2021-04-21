import React, { useEffect, useRef, useState } from "react";

import { RadioGroup } from "src/components/RadioGroup";
import { Toast } from "primereact/toast";
import { RECORDING_TIME, STATUS } from "src/constants/app-constants";
import { InputField } from "src/components/InputField";
import { CSSTransition } from "react-transition-group";
import { SendButton } from "src/components/SendButton";
import { IsToneSwitcher } from "src/components/IsToneSwitcher";
import { StatusButton } from "src/components/StatusButton";
import { useMethodsSetter } from "src/hooks/useMethodsSetter";
import { useCallSSE } from "src/hooks/useCallSSE";
import { useStatusChecker } from "src/hooks/useStatusChecker";
import { RecordingDialog } from "src/components/Dialogs/RecordingDialog";
import { MenuIcon as MenuThemeIcon } from "src/components/MenuIcon";
import axios from "axios";
import { IncomingCallDialog } from "src/components/Dialogs/IncomingCallDialog";
import { getMediaStreamError } from "src/utils/functionalUtils";
import { MEDIA_STREAM } from "src/constants/user-media";
import { validate } from "src/services/validationServices";

export function MainPage() {
  const [status, setStatus] = useState(STATUS.SYSTEM.LOADING);
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
  const [isSpinner, setIsSpinner] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toast = useRef(null);
  const buttonCallback = useRef(null);

  const [toastsStack, setToastStack] = useState([]);

  const addToast = (payload, stopLoading = true) =>
    stopLoading
      ? setToastStack((toasts) => [
          ...toasts,
          ...(Array.isArray(payload) ? payload : [payload]),
        ])
      : toast.current?.show(payload);

  const queryStatus = (setLoading) => {
    setLoading?.(true);
    axios
      .get("/get-status")
      .catch((e) => {
        console.error(e);
        addToast({
          severity: "warn",
          summary: "Ошибка",
          detail: "Ошибка запроса на сервер, обновите страницу",
        });
      })
      .finally(() => {
        setLoading?.(false);
      });
  };

  useEffect(() => {
    setIsSpinner(false);
  }, [status, toastsStack]);

  useEffect(() => {
    if (!toast.current || !toastsStack.length) return;

    toast.current?.show(toastsStack.pop());
    setToastStack([...toastsStack]);
    buttonCallback.current?.();
  }, [toastsStack]);

  useEffect(() => {
    if (status === STATUS.READY) {
      buttonCallback.current?.();
    }
  }, [status]);

  useMethodsSetter({ setToastStack, setMethods, setDevicesStatus });

  useEffect(() => {
    getMediaStreamError()
      .then(() => {
        setDevicesStatus((status) => ({ ...status, microphone: true }));
      })
      .catch((error) => {
        setDevicesStatus((status) => ({ ...status, microphone: error.name }));
        switch (error.name) {
          case MEDIA_STREAM.ERROR.NOT_ALLOWED:
            addToast({
              severity: "warn",
              summary: "Ошибка доступа",
              detail: "Предоставьте доступ к микрофону",
              life: "<frontend port>",
            });
            break;
          case MEDIA_STREAM.ERROR.NOT_FOUND:
            addToast({
              severity: "error",
              summary: "Ошибка",
              detail: "Микрофон не обнаружен",
              life: "<frontend port>",
            });
            break;
          default:
        }
      });
  }, []);

  useCallSSE({
    onError: () => {
      addToast({
        severity: "error",
        summary: "Ошибка",
        detail: "Нет связи с сервером, обновите страницу",
      });
      setDevicesStatus((status) => ({ ...status, server: false }));
    },
    onMessage: (e) =>
      addToast({
        severity: "info",
        summary: "Сообщение",
        detail: e.data,
      }),
    onOpen: () => setDevicesStatus((status) => ({ ...status, server: true })),
    onInit: () => {
      addToast(
        {
          severity: "info",
          summary: "Совершается вызов",
          detail: "Вызов инициализирован",
        },
        false
      );
      setIsSpinner(false);
    },
    onRinging: () => setStatus(STATUS.CALL.RINGING),
    onInProgress: () => setStatus(STATUS.CALL.IN_PROGRESS),
    onCompleted: () => {
      addToast({
        severity: "success",
        summary: "Успех",
        detail: "Вызов успешно завершен",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
    },
    onFailed: (number) => {
      addToast({
        severity: "error",
        summary: "Ошибка вызова",
        detail: "Невозможно набрать номер " + number.data || "",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
    },
    onBusy: () => {
      addToast({
        severity: "warn",
        summary: "Занято",
        detail: "Вызов сброшен",
      });
      if (status !== STATUS.SYSTEM.ERROR) setStatus(STATUS.READY);
    },
    onStatus: (event) => {
      try {
        const { type, id, status, message } = JSON.parse(event.data);

        if (!status) {
          return toast.current?.show([
            {
              severity: "info",
              summary: "Пусто",
              detail: "Нет данных",
            },
          ]);
        }

        const severity =
          status === STATUS.RESULT.SUCCESS
            ? "success"
            : status === STATUS.RESULT.FAILRUE
            ? "warn"
            : "info";

        const result =
          status === STATUS.RESULT.SUCCESS
            ? "Успешно"
            : status === STATUS.RESULT.FAILRUE
            ? "Провалено"
            : "Статус";

        toast.current?.show([
          message && {
            severity: "info",
            summary: "Сообщение",
            detail: message,
          },
          {
            severity: severity,
            summary: `${result} - ${type || "Нет типа вызова"}`,
            detail: id || "Нет идентификатора",
          },
          message && {
            severity: "info",
            summary: "Статус",
            detail: message,
          },
        ]);
      } catch (e) {}
    },
  });

  useStatusChecker({ devicesStatus, methods, setStatus });

  const onClickHandler = async () => {
    setIsSpinner(true);

    if (!validate(selectedKey, input)) {
      setIsActive(true);
      setIsSpinner(false);
      buttonCallback.current?.();
      return;
    }

    axios.post(
      "/auth",
      {
        key: selectedKey,
        extraKey: selectedExtraKey,
        isTone,
        id: input?.replace(/[^\d+]/g, ""),
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
  };

  const isExtra = methods && methods[selectedKey]?.extra;

  return (
    <div
      className="p-d-flex p-jc-center p-ai-start"
      style={{ backgroundColor: "var(--surface-a)", height: "100vh" }}
    >
      <div
        className="p-col-4 p-nogutter"
        style={{
          minWidth: "400px",
          padding: "0 40px 40px",
          backgroundColor: "var(--surface-b)",
        }}
      >
        <div className="p-d-flex p-ai-center p-col-5 p-jc-between">
          <h1>Диплом</h1>
          <MenuThemeIcon selected={selectedKey} />
        </div>
        <Toast ref={toast} />
        {status === STATUS.CALL.RINGING && <IncomingCallDialog />}
        <RecordingDialog
          visible={status === STATUS.CALL.IN_PROGRESS}
          time={RECORDING_TIME}
        />
        <InputField
          isActive={isActive}
          value={input}
          onChange={(input) => {
            setIsActive(false);
            setInput(input);
          }}
          status={status}
          item={methods?.[selectedKey]}
        />
        <div className="p-grid p-nogutter p-mt-1 p-ml-2">
          <RadioGroup
            status={status}
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
                  status={status}
                  isSkeleton={!showExtra}
                  selected={selectedExtraKey}
                  setSelected={setSelectedExtraKey}
                  items={methods?.[selectedKey]?.extra}
                />
              </div>
            </CSSTransition>
          </div>
        </div>
        <IsToneSwitcher status={status} isTone={isTone} setIsTone={setIsTone} />
        <div className="p-mt-5 p-d-flex p-col-6 p-ai-end p-jc-between">
          <SendButton
            isSpinner={isSpinner}
            status={status}
            onClick={onClickHandler}
            stopLoader={buttonCallback}
          />
          <StatusButton status={status} toast={toast} onClick={queryStatus} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
