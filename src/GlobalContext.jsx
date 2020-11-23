import React, { createContext, useState, useEffect } from "react";
import VotingSystem from "./votingstuff";

export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [votingController, setVotingController] = useState(null);

  useEffect(() => {
    VotingSystem().then((controller) => {
      setVotingController(controller);
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={votingController ? { ...votingController } : false}
    >
      {children}
    </GlobalContext.Provider>
  );
}
