import { useState, useEffect } from "react";
import { ethers } from "ethers";

import PropJson from "../../contracts/MonopolyProp.json";
import BuildJson from "../../contracts/MonopolyBuild.json";
import BankJson from "../../contracts/MonopolyBank.json";

export default function Land(props) {
  const landInfo = props.land_info;

  return (
    <div>
      <div>{landInfo.title}</div>
      <div>Rare price: {landInfo.prices.rare} MONO$</div>
      <button>Buy</button>
      <button>Sell</button>
      <div>Uncommon price: {landInfo.prices.uncommon} MONO$</div>
      <button>Buy</button>
      <button>Sell</button>
      <div>Common price: {landInfo.prices.common} MONO$</div>
      <button>Buy</button>
      <button>Sell</button>
      <div>House price: {landInfo.bprices.house} MONO$</div>
      <button>Buy</button>
      <button>Sell</button>
      <div>Hotel price: {landInfo.bprices.hotel} MONO$</div>
      <button>Buy</button>
      <button>Sell</button>
    </div>
  );
}
