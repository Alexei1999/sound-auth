import axios from "axios";
import React from "react";
import { useContextStore } from "src/reducers/reducer";
import { SendButton } from "./SendButton";
import { StatusButton } from "./StatusButton";

export function FooterButtons({ onClickHandler, buttonCallback, toastWarn }) {
  const {
    status,
    view: { isSpinner },
  } = useContextStore();
  return (
    <div
      style={{ maxWidth: "250px", minWidth: "210px" }}
      className="p-mt-5 p-d-flex p-col-6 p-ai-end p-jc-between"
    >
      <SendButton
        isSpinner={isSpinner}
        status={status}
        onClick={onClickHandler}
        stopLoader={buttonCallback}
      />
      <StatusButton
        status={status}
        onClick={(setLoading) => {
          setLoading?.(true);
          axios
            .get("/get-status")
            .catch((e) => {
              console.error(e);
              toastWarn(
                "Ошибка",
                "Ошибка запроса на сервер, обновите страницу"
              );
            })
            .finally(() => {
              setLoading?.(false);
            });
        }}
      />
    </div>
  );
}
