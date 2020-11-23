import React, { createContext, useState, useEffect } from "react";
import VotingSystem from "./votingstuff";

export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [votingController, setVotingController] = useState();

  useEffect(() => {
    VotingSystem().then(setVotingController);
  }, []);

  return (
    <GlobalContext.Provider value={{ ...votingController }}>
      {children}
    </GlobalContext.Provider>
  );
}
