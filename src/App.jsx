import React, { useEffect } from "react";

import contract from "@truffle/contract";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    getWeb3().then(async (web3) => {
      const Election = contract(ElectionContract);
      console.log(web3.currentProvider);
      Election.setProvider(web3.currentProvider);
      const instance = await Election.deployed();
      const candidateCount = await instance.candidatesCount();
      console.log(candidateCount.toNumber());
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
