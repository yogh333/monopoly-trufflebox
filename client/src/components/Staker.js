
import React, {useState, useEffect} from 'react';
import Tairreux from "../contracts/Tairreux.json";
import Rogue from "../contracts/Rogue.json";
import User from "./User/User.js";
import {ethers} from "ethers";
import ObsBalance from "./ObsBalance";


const Staker = (props) => {

	var drone = false;
	var droneST = false;

	var address = window.ethereum.selectedAddress;

	const [amount, setAmount] = useState("");
	const [effective, setEffective] = useState(0);
	const [deposit, setDeposit] = useState(0);

	const provider = props.p;
	
	const MPs = new ethers.Contract(
				Rogue.networks[1337].address,
					Rogue.abi,
					provider.getSigner()
		);

	const _networkID = 1337;

  const stMPs = new ethers.Contract(
	    Tairreux.networks[1337].address,
		    Tairreux.abi,
		    provider.getSigner()
	);

  useEffect(() => {

		async function fetch() {
			console.log("debug");
		} 
		fetch();
	}, []);

	return(
		<div>
			<div>
				<p>lets go shut up fucking staker</p>
			</div>
			<div>
				<User 
					eth_provider = {provider}
					eth_address = {address} />
			</div>
			<div>
				<output name="address">{"_address :" + window.ethereum.selectedAddress}</output> 
				<br></br>
				<output> {"your deposit on contract " + deposit} </output>
				<ObsBalance
					text="coin on your wallet "
					contract={MPs}
					/>
				<ObsBalance
					text="your deposit on contract "
					contract={stMPs}
					/>
				<br></br>
				<input 
					type="text" 
					value= {amount}
					id="amount"
					onChange={(e) => {
						console.log(e.target.value);
						setAmount(e.target.value);} 
					} />
				<br></br>
				<input
					onClick={ async () => {
						var _balance = await MPs.balanceOf(address);
						setAmount(_balance.toNumber());
						setEffective(_balance.toNumber());
						}
					}
					type="button"
					value="MAX"/>
				<div>
					<input
						onClick={ async () => {
								console.log(effective, amount)
								if(amount ==effective){
									await MPs.approve(stMPs.address, amount, {from:address});
									stMPs.depositAll();
								}
							}
						}
						type="button"
						value="Deposit"/>
				</div>
			</div>
		</div>
	);
}

export default Staker;
