import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

import "./App.css";

import Paris from "./data/Paris.json";
import Grid from "./components/Grid";
import User from "./components/User/User";
import Land from "./components/Land/Land";

import BankJson from "./contracts/MonopolyBank.json";

function App() {
  const [visual, setVisual] = useState(<div>Property visual</div>);
  const [provider, setProvider] = useState(null);
  const [connect, setConnect] = useState(
    <Button variant="info" size="sm" onClick={connectWallet}>
      Connect
    </Button>
  );
  const [address, setAddress] = useState("");
  const [landinfo, setLandInfo] = useState({
    title: "undefined",
    prices: { rare: "0", uncommon: "0", common: "0" },
    bprices: { house: "0", hotel: "0" },
  });

  const [bankSC, setBankSC] = useState(null);

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let p = await new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.on("accountsChanged", (accounts) => {
          setAddress(accounts[0]);
          setConnect(
            <Button variant="success" size="sm" disabled>
              {window.ethereum.selectedAddress}
            </Button>
          );
        });
        let bank = new ethers.Contract(
          BankJson.networks[123456789].address,
          BankJson.abi,
          p.getSigner()
        );
        setBankSC(bank);
        setConnect(
          <Button variant="success" size="sm" disabled>
            {window.ethereum.selectedAddress}
          </Button>
        );
        setAddress(window.ethereum.selectedAddress);
        setProvider(p);
      }
    }
  }

  async function displayInfo(cellID) {
    setVisual(<img className="land" src={Paris[cellID].visual} />);
    if (bankSC != null) {
      console.log("get prices !");
      let prop_prices = [];
      for (let i = 0; i < 3; i++) {
        prop_prices[i] = await bankSC.getPriceOfProp(0, cellID, i);
      }
      let build_prices = [];
      for (let i = 0; i < 2; i++) {
        build_prices[i] = await bankSC.getPriceOfBuild(0, cellID, i);
      }
      let land = {
        title: Paris[cellID].name,
        prices: {
          rare: ethers.utils.formatUnits(prop_prices[0]),
          uncommon: ethers.utils.formatUnits(prop_prices[1]),
          common: ethers.utils.formatUnits(prop_prices[2]),
        },
        bprices: {
          house: ethers.utils.formatUnits(build_prices[0]),
          hotel: ethers.utils.formatUnits(build_prices[1]),
        },
      };
      setLandInfo(land);
    }
  }

  return (
    <div className="App">
      <div className="info-area-1">
        <h2>User info</h2>
        {connect}
        {provider && <User eth_provider={provider} eth_address={address} />}
      </div>
      <div className="info-area-2">
        <h2>Property Visual</h2>
        {visual}
      </div>
      <div className="info-area-3">
        <h2>Misc</h2>
      </div>
      <div className="info-area-4">
        <h2>Property Info</h2>
        {provider && <Land eth_provider={provider} land_info={landinfo} />}
      </div>
      <div className="main-area">
        <Grid data={Paris} displayInfo={displayInfo} />
      </div>
    </div>
  );
}

export default App;
