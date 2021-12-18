import React from "react";
import "./Grid.css";

export default function Grid(props) {
  let elements = [];

  function handleClick(e) {
    console.log(e.target.id.substring(5));
    props.displayInfo(parseInt(e.target.id.substring(5)));
  }

  props.data.forEach((element, index) => {
    let id = "cell-" + index;
    let position = "bottom"

    if (index >= 11 && index <= 19) {
      position = "left"
    } else if (index >= 20 && index <= 30) {
      position = "top"
    } else if (index > 30){
      position = "right"
    }

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
