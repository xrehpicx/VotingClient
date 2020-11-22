import React, { useEffect, useState } from "react";

import contract from "@truffle/contract";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [account, setAccount] = useState();
  const [instance, setInstance] = useState();

  useEffect(() => {
    getWeb3().then(async (web3) => {
      const Election = contract(ElectionContract);
      console.log(web3.currentProvider);
      Election.setProvider(web3.currentProvider);
      const ins = await Election.deployed();
      setInstance(ins);
      const candidateCount = (await ins.candidatesCount()).toNumber();

      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await ins.candidates(i);
        const candidateId = candidate[0].toNumber();
        const candidateName = candidate[1];
        const candidateVotes = candidate[2].toNumber();
        // console.log(candidateId, candidateName, candidateVotes);
        const chainId = await web3.eth.getChainId();
        console.log(chainId);
        web3.eth.getCoinbase(function (err, acc) {
          if (err === null) {
            setAccount(acc);
          }
        });
        setCandidates((cans) => [
          ...cans,
          { id: candidateId, name: candidateName, votes: candidateVotes },
        ]);
      }
    });
  }, []);

  const onclick = (candidateId) => {
    instance.vote(candidateId, { from: account });
  };

  return (
    <div className="App">
      <header className="App-header">
        your account: {account}
        {candidates.map((can, i) => (
          <div
            onClick={() => onclick(can.id)}
            key={i}
            style={{
              padding: "10px",
              margin: "10px",
              background: "black",
            }}
          >
            <p>{can.name}</p>
            <div>
              <p>id: {can.id}</p>
              <p>votes: {can.votes}</p>
            </div>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
