import { useState, useEffect } from "react";
import { ethers } from "ethers";

import MonoJson from "../../contracts/MonopolyMono.json";
import BankJson from "../../contracts/MonopolyBank.json";
import PropJson from "../../contracts/MonopolyProp.json";
import BuildJson from "../../contracts/MonopolyBuild.json";
import BoardJson from "../../contracts/MonopolyBoard.json";

import "./User.css";
import Button from "react-bootstrap/Button";

export default function User(props) {
  const provider = props.eth_provider;
  const address = props.eth_address;
  const networkId = props.eth_network_id;

  const [balance, setBalance] = useState("?");
  const [prop, setProp] = useState(0);

  /*
  const [rollDiceButton] = useState(
      <Button type='submit' variant="danger" size="sm" className='btn btn-primary btn-lg btn-block' onClick={rollDiceFunction}>
        Roll the dice!
      </Button>
  );
  */

  const [rollDice, setRollDice] = useState(2);

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

  //to use the smart contract MonopolyBoard.sol
  const BoardSC = new ethers.Contract(
      BoardJson.networks[networkId].address,
      BoardJson.abi,
      provider.getSigner()
  );

  let bank = new ethers.Contract(
      BankJson.networks[window.ethereum.networkVersion].address,
      BankJson.abi,
      provider.getSigner()
  );

  useEffect(() => {
    MonoSC.balanceOf(address).then((value) =>
      setBalance(ethers.utils.formatUnits(value))
    );
  }, []);

  useEffect(() => {
    PropSC.balanceOf(address).then((value) => setProp(value.toNumber()));
  });

  /**
   * name: rollDiceFunction
   * description: simulate the roll of dice to move the game forward
   * @returns {Promise<void>}
   */
  async function rollDiceFunction(){

    if (BoardSC != null){
      //alert ("You are rolling the dice");

      const  newValue = Math.floor(Math.random() * 6 + 1);

      console.log('newValue: ', newValue );
      setRollDice(newValue);

      const edition = await BoardSC.getMaxEdition();
      console.log('edition: ', edition);

      const nbLands = await BoardSC.getNbLands(edition);
      console.log('nbLands: ', nbLands);

      //display of dices
      let diceImage;
      diceImage = (
          <img
            className="dice"
            src={require(`../../data/diceFaces/dice_face_${newValue}.png`)}
            alt="dice display"
          />
      );

      //const nb = await BoardSC.getRandomNumber();

      //const nb = await BoardSC.getRandomNumber().call();
      //const nb = await BoardSC.getRandomNumber.call();

      //const { accounts, contract } = this.state;
      //await contract.methods.getRandomNumber().send({from:accounts[0]});
      //await contract.methods.fulfillRandomness().send({from:accounts[0]});


    }
  }


  return (
    <div>
      <div>{balance} MONO$</div>
      <div>{prop} PROP$</div>

      <div>
        {rollDice}
      </div>

    </div>
  );
}
