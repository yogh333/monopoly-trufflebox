import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import MonoJson from "../../contracts/MonopolyMono.json";
import BankJson from "../../contracts/MonopolyBank.json";
import PropJson from "../../contracts/MonopolyProp.json";
import BuildJson from "../../contracts/MonopolyBuild.json";

import "./User.css";

export default function User(props) {
  const provider = props.eth_provider;
  const address = props.eth_address;

  const [balance, setBalance] = useState("?");
  const [prop, setProp] = useState(0);
	const [web3, setWeb3] = useState(false);

  const MonoSC = new ethers.Contract(
    MonoJson.networks[1639998348801].address,
    MonoJson.abi,
    provider.getSigner()
  );

  const PropSC = new ethers.Contract(
    PropJson.networks[1639998348801].address,
    PropJson.abi,
    provider.getSigner()
  );

	async function display(){
		var bal = await MonoSC.balanceOf(address);
		console.log("hoyyyyyyy",bal.toNumber());
		setBalance(bal.toNumber());
	}

  useEffect(() => {
		if(!web3){
			display();
			setWeb3(true);
		}
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
