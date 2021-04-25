import React from "react";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";

import MainPage from "./pages/MainPage";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ReceiveCallPage } from "./pages/ReceiveCallPage";
import { ContextProvider } from "./reducers/reducer";
import { ToastProvider } from "./components/shared/ToastProvider";
import { MainPageEventsBoundary } from "./components/MainPage/MainPageContainer/MainPageEventsBoundary";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <ToastProvider>
          <MainPageEventsBoundary>
            <HashRouter>
              <Switch>
                <Route path="/device">
                  <ReceiveCallPage />
                </Route>
                <Route path="/">
                  <MainPage />
                </Route>
              </Switch>
            </HashRouter>
          </MainPageEventsBoundary>
        </ToastProvider>
      </ContextProvider>
    </div>
  );
}

export default App;
