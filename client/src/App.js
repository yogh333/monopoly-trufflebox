import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

import "./App.css";

import Paris from "./data/Paris.json";
import Grid from "./components/Grid";
import User from "./components/User/User";

function App() {
  const [visual, setVisual] = useState(<div>Property visual</div>);
  const [info, setInfo] = useState(<div>Property details</div>);

  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let p = new ethers.providers.Web3Provider(window.ethereum);
        console.log(p);
        window.ethereum.on("accountsChanged", (accounts) => {
          setAddress(accounts[0]);
        });
        setAddress(window.ethereum.selectedAddress);
        setProvider(p);
      }
    }
  }

  function displayInfo(cellID) {
    setVisual(<img className="land" src={Paris[cellID].visual} />);
    setInfo(<div>{Paris[cellID].name}</div>);
  }

  return (
    <div className="App">
      <div className="info-area-1">
        <User eth_address={address} eth_provider={provider} connect={connectWallet} />
      </div>
      <div className="info-area-2">
        <h2>Visual</h2>
        {visual}
      </div>
      <div className="info-area-3">Miscelaneous</div>
      <div className="info-area-4">
        <h2>Details</h2>
        {info}
      </div>
      <div className="main-area">
        <Grid data={Paris} displayInfo={displayInfo} />
      </div>
    </div>
  );
}

export default App;
