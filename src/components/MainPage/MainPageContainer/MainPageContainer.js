import React from "react";
import { MainPageEventsBoundary } from "./MainPageEventsBoundary";

export function MainPageContainer({ children }) {
  return (
    <MainPageEventsBoundary>
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
          {children}
        </div>
      </div>
    </MainPageEventsBoundary>
  );
}
