import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";

import "./Game.css";

import Paris from "../../data/Paris.json";
import Grid from "../Grid";
import User from "../User/User";
import Land from "../Land/Land";

import BankJson from "../../contracts/MonopolyBank.json";

function Game(props) {
  const [visual, setVisual] = useState(<div>Property visual</div>);
  const [landInfo, setLandInfo] = useState({
    title: "undefined",
    prices: { rare: "0", uncommon: "0", common: "0" },
    bprices: { house: "0", hotel: "0" },
  });

  function retrieveProvider() {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  const provider = retrieveProvider();

  //console.log(props.network_id);

  const bankSC = new ethers.Contract(
    BankJson.networks[props.network_id].address,
    BankJson.abi,
    provider
  );

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
    <div className="Game">
      <div className="info-area-1">
        <h2>User info</h2>
        {provider && (
          <User
            provider={provider}
            address={props.address}
            network_id={props.network_id}
          />
        )}
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
        {<Land land_info={landInfo} />}
      </div>
      <div className="main-area">
        <Grid data={Paris} displayInfo={displayInfo} />
      </div>
    </div>
  );
}

export default Game;
