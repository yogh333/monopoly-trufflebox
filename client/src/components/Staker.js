
import React, {useState, useEffect} from 'react';
import Tairreux from "../contracts/Tairreux.json";
import Rogue from "../contracts/Rogue.json";
<<<<<<< HEAD
import User from "./User.js";

import Spinner from "react-bootstrap/Spinner";

=======
import User from "./User/User.js";
>>>>>>> b91993e6cb0c25868596e5407c615bbf514f1737
import {ethers} from "ethers";
import ObsBalance from "./ObsBalance";


const Staker = (props) => {

<<<<<<< HEAD
  const spinner = <Spinner as="span" animation="border" size="sm" />;

	const [isReadyToRender, setIsReadyToRender] = useState(false);
=======
	var drone = false;
	var droneST = false;

>>>>>>> b91993e6cb0c25868596e5407c615bbf514f1737
	var address = window.ethereum.selectedAddress;

	const [amount, setAmount] = useState("");
	const [effective, setEffective] = useState(0);
	const [deposit, setDeposit] = useState(0);

	const provider = props.p;
<<<<<<< HEAD
	const _networkID = props.n;
		
	const [MPs, setMPs] = useState(null);
	const [stMPs, setstMPs] = useState(null);

  useEffect(() => {
  
    if (!(provider && address && _networkID)) {
    	setIsReadyToRender(false);
    	console.log("render False");
    	return
    }
    const _MPs = new ethers.Contract(
			Rogue.networks[_networkID].address,
			Rogue.abi,
			provider.getSigner()
		);
		setMPs(_MPs);
		const _stMPs = new ethers.Contract(
	    Tairreux.networks[_networkID].address,
		  Tairreux.abi,
		  provider.getSigner()
		);
		setstMPs(_stMPs);
		setIsReadyToRender(false);
		if(!(MPs && stMPs))
			console.log("render True");
			setIsReadyToRender(true);
	},[provider]);

  if (!isReadyToRender) {
    return (<>{spinner}</>)
  }
=======
	
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

>>>>>>> b91993e6cb0c25868596e5407c615bbf514f1737
	return(
		<div>
			<div>
				<p>lets go shut up fucking staker</p>
			</div>
			<div>
				<User 
<<<<<<< HEAD
          provider={provider}
          address={address}
          network_id={_networkID} />
=======
					eth_provider = {provider}
					eth_address = {address} />
>>>>>>> b91993e6cb0c25868596e5407c615bbf514f1737
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
