import React from "react";
import "../css/Grid.css";

import Paris from "../data/Paris.json";

export default function Grid(props) {
  let elements = [];

  function handleClick(e) {
    console.log(e.target.id.substring(5));
    props.displayInfo(parseInt(e.target.id.substring(5)));
  }

  props.data.forEach((element, index) => {
    const id = "cell-" + index;
    const position = Paris.lands[index].position

    elements.push(
      /*<img
        src={element.visual}
        id={id}
        className={`cell ${position}-line`}
        onClick={handleClick}
      />*/
      <div id={id} key={id} className={`cell ${position}-line`} onClick={handleClick}></div>
    );
  });

  return <div className="board">{elements}</div>;
}
