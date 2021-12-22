
import React, {useState, useEffect} from 'react';
import Web3 from "web3";

import CustomStaker from "./STAKER/CustomStaker.js"

const getWeb3 = async () => {	new Promise((resolve, reject) => {
  window.addEventListener("load", async () => {
		const _web3 = await new Web3("http://localhost:8545");
		const	_networkID = await _web3.eth.net.getId();
		resolve(_web3);
		});
	});
}

const Staker = (props) => {

	const [amount, setAmount] = useState(0);
	const [web3, setWeb3] = useState(null);
	const [balance, setBalance] = useState(0);
	
	var _networkID = null	

	const setter = async () => {
		console.log("debug");
	}

	const _web3 = setter();
	
	if(_web3)
		return(
			<div>
				<div>
					<p>lets go shut up fucking staker</p>
				</div>
				<div>
					<output name="address">{"_address :" + window.ethereum.selectedAddress}</output>
					<CustomStaker
						amount={amount}
						action={setAmount}
						web3={web3}
						update={setWeb3}
						setBalance = {setBalance}
					/>	
				</div>
			</div>
		);

	return(<p>LOADED</p>);
}

export default Staker;
