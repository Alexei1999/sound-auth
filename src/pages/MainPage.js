import React, { useRef, useState } from "react";

import { RadioGroup } from "src/components/RadioGroup";
import { Toast } from "primereact/toast";
import { RECORDING_TIME, STATUS } from "src/constants/app-constants";
import { InputField } from "src/components/InputField";
import { CSSTransition } from "react-transition-group";
import { SendButton } from "src/components/SendButton";
import { IsToneSwitcher } from "src/components/IsToneSwitcher";
import { StatusButton } from "src/components/StatusButton";
import { useMediaStreamSetter } from "src/hooks/useMediaStreamSetter";
import { useMethodsSetter } from "src/hooks/useMethodsSetter";
import { useSSESetter } from "src/hooks/useSSESetter";
import { useStatusChecker } from "src/hooks/useStatusChecker";
import { useQueryStatus } from "src/hooks/useQueryStatus";
import { RecordingDialog } from "src/components/RecordingDialog";
import { MenuIcon as MenuThemeIcon } from "src/components/MenuIcon";

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

  const toast = useRef(null);

  const queryStatus = useQueryStatus(toast);

  useMethodsSetter({ toast, setMethods, setDevicesStatus });
  useMediaStreamSetter({ setDevicesStatus });
  useSSESetter({ toast, status, queryStatus, setStatus, setDevicesStatus });
  useStatusChecker({ devicesStatus, methods, setStatus });

  const onClickHandler = async () => {};

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
        {status === STATUS.CALL.IN_PROGRESS && (
          <RecordingDialog time={RECORDING_TIME} />
        )}
        <InputField
          value={input}
          onChange={setInput}
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
          <SendButton status={status} onClick={onClickHandler} />
          <StatusButton status={status} toast={toast} onClick={queryStatus} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
