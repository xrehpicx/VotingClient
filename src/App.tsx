import React from "react";

import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import logo from "./logo.svg";

import "./App.css";

function App() {
  const [state, setState] = React.useState<any>({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
  });

  React.useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId: string = await web3.eth.net.getId();
        // @ts-ignore
        const deployedNetwork = ElectionContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState({ web3, accounts, contract: instance });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  });

  if (state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 40</strong> of App.js.
      </p>
      <div>The stored value is: {state.storageValue}</div>
    </div>
  );
}

export default App;
