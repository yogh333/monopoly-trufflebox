import {useState, useEffect} from "react";
import {ethers} from "ethers";
import Dice from "./../Dice/Dice"

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

    const [rollDice, setRollDice] = useState([2, 4]);
    const [currentPosition, setCurrentPosition] = useState(0);

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
    async function rollDiceFunction() {
        if (BoardSC == null) return;
        //alert ("You are rolling the dice");

        const generateNewNumber = () => Math.floor(Math.random() * 6 + 1);
        //const [newValue1, newValue2] = [null,null].map(generateNewNumber)
        const newValue1 = generateNewNumber();
        const newValue2 = generateNewNumber();

        console.log({rollDice})

        // const total = rollDice[0] + rollDice[1];
        const total = calculateTotal(newValue1, newValue2)
        handleNewPosition(currentPosition, total);
        console.log({total});
        setRollDice([newValue1, newValue2]);

        const edition = await BoardSC.getMaxEdition();
        console.log('edition: ', edition);

        const nbLands = await BoardSC.getNbLands(edition);
        console.log('nbLands: ', nbLands);
    }

    function handleNewPosition(previousPosition, total){
        const newCell = previousPosition + total;
        if (newCell >= 40) return;
        highlightCurrentCell(newCell)
        setCurrentPosition(newCell)
        forgetPreviousPosition(previousPosition)
        }

    function forgetPreviousPosition(previousPosition) {
    document.getElementById(`cell-${previousPosition}`).classList.remove("active")
    }

    function highlightCurrentCell(total){
        const activeCell = document.getElementById(`cell-${total}`);
        activeCell.classList.add("active")
    }

    function calculateTotal(...args){
        console.log({args})
        //console.log({num1, num2})
        return args.reduce((total, current) => total + current,0);

    }


    //const nb = await BoardSC.getRandomNumber();

    //const nb = await BoardSC.getRandomNumber().call();
    //const nb = await BoardSC.getRandomNumber.call();

    //const { accounts, contract } = this.state;
    //await contract.methods.getRandomNumber().send({from:accounts[0]});
    //await contract.methods.fulfillRandomness().send({from:accounts[0]});


    return (
        <div>
            <div>{balance} MONO$</div>
            <div>{prop} PROP$</div>

            <Button type='submit' variant="danger" size="sm" className='btn btn-primary btn-lg btn-block'
                    onClick={rollDiceFunction}>
                Roll the dice!
            </Button>

            <div>
                {rollDice[0]}
                {rollDice[1]}

                <img
                    className="dice"
                    src={require(`../../../build/images/dice_face_${rollDice[0]}.png`).default}
                    alt="dice display"
                />

                <img
                    className="dice"
                    src={require(`../../../build/images/dice_face_${rollDice[1]}.png`).default}
                    alt="dice display"
                />



            </div>

        </div>
    );
}
