import React, { useEffect, useState, useContext } from "react";

import { GlobalContext } from "./GlobalContext";

function App() {
  const votingController = useContext(GlobalContext);
  console.log(votingController);

  return <div className="App"></div>;
}

export default App;
