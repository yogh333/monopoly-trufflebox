import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Spinner from "react-bootstrap/Spinner"

import MonoJson from "../contracts/MonopolyMono.json";
import PropJson from "../contracts/MonopolyProp.json";

import "../css/User.css";

export default function User(props) {
  const spinner = <Spinner as="span" animation="border" size="sm" />

  const provider = props.provider;
  const address = props.address;
  const networkId = props.network_id;

  const [balance, setBalance] = useState(spinner);
  const [prop, setProp] = useState(0);

  const MonoSC = new ethers.Contract(
    MonoJson.networks[networkId].address,
    MonoJson.abi,
    provider
  );

  const PropSC = new ethers.Contract(
    PropJson.networks[networkId].address,
    PropJson.abi,
    provider
  );

  useEffect(() => {
    MonoSC.balanceOf(address).then((value) =>
      setBalance(ethers.utils.formatUnits(value))
    );
    PropSC.balanceOf(address).then((value) => setProp(value.toNumber()));
  }, [address]);

  return (
    <div>
      <div>{balance} MONO$</div>
      <div>{prop} PROP$</div>
    </div>
  );
}
