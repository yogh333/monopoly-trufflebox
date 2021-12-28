import {useState, useEffect} from "react";
import {ethers} from "ethers";

import MonoJson from "../../contracts/MonopolyMono.json";
import BankJson from "../../contracts/MonopolyBank.json";
import PropJson from "../../contracts/MonopolyProp.json";
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
     * description: simulates the roll of dice to move the game forward and to move on the pawn
     * @returns {Promise<void>}
     */
    async function rollDiceFunction() {
        if (BoardSC == null) return;

        //TODO: Replace by the call at the oracle
        console.log('BoardSC: ', BoardSC);
        BoardSC.on("GenerateRandomResult", (ramdomNumber) => {
            console.log('ramdomNumber: ', ramdomNumber);
        });

        /*
        filter = {
            address: THE_ADDRESS_OF_YOUR_CONTRACT,
            topics: [
                // the name of the event, parnetheses containing the data type of each event, no spaces
                utils.id("Transfer(address,address,uint256)")
            ]
        }
        provider.on(filter, () => {
            // do whatever you want here
            // I'm pretty sure this returns a promise, so don't forget to resolve it
        })
*/
        //const getRandomNumber = await BoardSC.getRandomNumber();
        //console.log('getRandomNumber(): ', getRandomNumber);



        //Generates a random number by JS
        /*
        const generateNewNumber = () => Math.floor(Math.random() * 6 + 1);

        const newValue1 = generateNewNumber();
        const newValue2 = generateNewNumber();

        console.log({rollDice})

        const total = calculateTotal(newValue1, newValue2)
        handleNewPosition(currentPosition, total);
        console.log('total:', {total});
        setRollDice([newValue1, newValue2]);
        */

    }

    const getRandomNumber = (event) => {



        /*
        let requestId;
        let randomness;
        if (!(BoardSC && requestId && randomness)) {
            return;
        }

        const type = event.target.getAttribute("data-type");
        //Bank.buyBuild(editionId, landInfo.id, type, 1).then();
        BoardSC.getRandomNumber().then();
        console.log()
        */

    };


    /**
     * name: handleNewPosition
     * description: make all the operations to determine and to display the new position of the future pawn
     * @param previousPosition
     * @param total
     */
    function handleNewPosition(previousPosition, total){
        const newCell = previousPosition + total;

        //TODO: to define more accurately
        if (newCell >= 40) return;
        highlightCurrentCell(newCell);
        setCurrentPosition(newCell);
        forgetPreviousPosition(previousPosition);
    }

    /**
     * name: forgetPreviousPosition
     * description: allows to remove the highlighting of the cell of the previous sum of the dice
     * @param previousPosition
     */
    function forgetPreviousPosition(previousPosition) {
        document.getElementById(`cell-${previousPosition}`).classList.remove("active");
    }

    /**
     * name: highlightCurrentCell
     * description: highlight the cell which is the result of the sum of the dice
     * @param total
     */
    function highlightCurrentCell(total){
        const activeCell = document.getElementById(`cell-${total}`);
        activeCell.classList.add("active");
    }

    /**
     * name: calculateTotal
     * description: calculate the sum of the results of the dice
     * @param args
     * @returns {*}
     */
    function calculateTotal(...args){
        console.log({args});
        //sum the parameters
        return args.reduce((total, current) => total + current,0);
    }

    return (
        <div>
            <div>{balance} MONO$</div>
            <div>{prop} PROP$</div>

            <Button type='submit' variant="danger" size="sm" className='btn btn-primary btn-lg btn-block'
                    onClick={rollDiceFunction}>
                Roll the dice!
            </Button>



            <div className='mt-3 ml-150'>

                {/* first dice display */}
                <img
                    className='dice-display'
                    src={require(`../../../build/images/dice_face_${rollDice[0]}.png`).default}
                    alt="dice display"

                />
            </div>

            <div className='mt-3 ml-150'>

                {/* second dice display */}
                <img
                    className='dice-display'
                    src={require(`../../../build/images/dice_face_${rollDice[1]}.png`).default}
                    alt="dice display"
                />

            </div>

        </div>
    );
}
