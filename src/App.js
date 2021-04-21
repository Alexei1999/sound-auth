import React from "react";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";

import MainPage from "./pages/MainPage";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ReceiveCallPage } from "./pages/ReceiveCallPage";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/connect">
            <ReceiveCallPage />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
