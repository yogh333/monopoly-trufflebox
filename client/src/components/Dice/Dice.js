import Dice1 from "../../assets/dice_face_1.png"
import Dice2 from "../../assets/dice_face_2.png"
import Dice3 from "../../assets/dice_face_3.png"
import Dice4 from "../../assets/dice_face_4.png"
import Dice5 from "../../assets/dice_face_5.png"
import Dice6 from "../../assets/dice_face_6.png"
import {useState} from "react";


export default function Dice(value) {
    const path = `../../assets/dice_face_${value}.png`;
    console.log({path})
    const initialValue = require(path).default;
    console.log(initialValue)
    const [source, setSource] = useState(initialValue)
    const images =
        [
            require('../../assets/dice_face_1.png').default,
            require('../../assets/dice_face_2.png').default,
            require('../../assets/dice_face_3.png').default,
            require('../../assets/dice_face_4.png').default,
            require('../../assets/dice_face_5.png').default,
            require('../../assets/dice_face_6.png').default
        ];
    const images2 = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    //const src = images2.at(value-1);

    console.log({source});
    return <img
        className="dice"
        src={source}
        alt="dice display"
    />
}