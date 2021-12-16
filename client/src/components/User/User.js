import { useState, useEffect } from "react";
import { ethers } from "ethers";

import MonoJson from "../../contracts/MonopolyMono.json";
import BankJson from "../../contracts/MonopolyBank.json";
import PropJson from "../../contracts/MonopolyProp.json";
import BuildJson from "../../contracts/MonopolyBuild.json";

import "./User.css";

export default function User(props) {
  const provider = props.eth_provider;
  const address = props.eth_address;
  const networkId = props.eth_network_id;

  const [balance, setBalance] = useState("?");
  const [prop, setProp] = useState(0);

  const MonoSC = new ethers.Contract(
    MonoJson.networks[networkId].address,
    MonoJson.abi,
    provider.getSigner()
  );

  const PropSC = new ethers.Contract(
    PropJson.networks[networkId].address,
    PropJson.abi,
    provider.getSigner()
  );

  useEffect(() => {
    MonoSC.balanceOf(address).then((value) =>
      setBalance(ethers.utils.formatUnits(value))
    );
  });

  useEffect(() => {
    PropSC.balanceOf(address).then((value) => setProp(value.toNumber()));
  });

  return (
    <div>
      <div>{balance} MONO$</div>
      <div>{prop} PROP$</div>
    </div>
  );
}
