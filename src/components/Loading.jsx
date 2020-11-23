import React, { useEffect, useState } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./css/loading.css";

export default function Loading() {
  const [web3loading, setWeb3loading] = useState(null);
  const [contract, setContract] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState([]);
  useEffect(() => {
    const onweb3loading = ({ detail }) => {
      setWeb3loading(detail);
    };
    const oncontractloading = ({ detail }) => {
      setContract(detail);
    };
    onemit("web3loading", onweb3loading);
    onemit("contract", oncontractloading);

    return () => {
      onemit("web3loading", onweb3loading, false);
      onemit("contract", oncontractloading, false);
    };
  }, []);

  useEffect(() => {
    if (contract) {
      const state = contract.state;
      if (state === 0) setLoadingMessage((ms) => [...ms, "obtaining contract"]);
      else if (state === 1)
        setLoadingMessage((ms) => [...ms, "connected with Election Contract"]);
      else if (state === 2)
        setLoadingMessage((ms) => [...ms, "obtaining your account details"]);
      else if (state === 3)
        setLoadingMessage((ms) => [
          ...ms,
          "connected using account: " + contract.account,
        ]);
    }
  }, [contract]);
  useEffect(() => {
    if (web3loading) {
      console.log(web3loading);
      const state = web3loading.state;
      if (state === 0)
        setLoadingMessage((ms) => [...ms, "connecting to ethernum"]);
      else if (state === 1)
        setLoadingMessage((ms) => [...ms, "connected to ethernum"]);
    }
  }, [web3loading]);

  return (
    <div className="loading-page">
      <h1>Vote</h1>
      <LinearProgress />

      {loadingMessage.map((mess, i) => (
        <p key={i}>{mess}</p>
      ))}
    </div>
  );
}

function onemit(name, callback, create = true) {
  if (create) document.addEventListener(name, callback);
  else document.removeEventListener(name, callback);
}
