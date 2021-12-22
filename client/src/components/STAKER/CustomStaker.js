
import React, {useState} from 'react';
import Tairreux from "../../contracts/Tairreux.json";
import Rogue from "../../contracts/Rogue.json";
import Web3 from "web3";



const CustomStaker = (props) => {

	let MPs;	
	
	const setter = 	async () => { 
		const _web3 = await new Web3("http://localhost:8545");
		const	_networkID = await _web3.eth.net.getId();		
		console.log(_networkID);
		let stMPs = null;
		MPs = await new _web3.eth.Contract(Rogue["abi"], Rogue.networks[_networkID].address);
		let balance = await MPs.methods.balanceOf(window.ethereum.selectedAddress).call();
		props.update(_web3);
		props.setBalance(balance);
	}
	
	setter();
	return (
    <div>
			<div>
				<output name="balance">{"_balance :" + props.balance}</output>
				<input 
					type="text" 
					value= {props.amount}
					id="amount"/>
				<input
					onClick={
						async () => {
							console.log("");
						}
					}
		      type="button"
		      value="MAX"/>
			</div>
    </div>
  );
}

export default CustomStaker;
