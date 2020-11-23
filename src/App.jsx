import React, { useEffect, useState, useContext } from "react";

import Home from "./components/Home";
import Loading from "./components/Loading";
import { GlobalContext } from "./GlobalContext";

function App() {
  const votingController = useContext(GlobalContext);

  return (
    <div className="App">{!votingController ? <Loading /> : <Home />}</div>
    // <Loading />
  );
}

export default App;
