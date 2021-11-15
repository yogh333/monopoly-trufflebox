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
    if (index >= 0 && index <= 10) {
      elements.push(
        /*<img
          src={element.visual}
          id={id}
          className="cell bottom-line"
          onClick={handleClick}
        />*/
        <div id={id} className="cell bottom-line" onClick={handleClick}></div>
      );
    } else if (index >= 11 && index <= 19) {
      elements.push(
        /*<img
          src={element.visual}
          id={id}
          className="cell left-line"
          onClick={handleClick}
        />*/
        <div id={id} className="cell left-line" onClick={handleClick}></div>
      );
    } else if (index >= 20 && index <= 30) {
      elements.push(
        /*<img
          src={element.visual}
          id={id}
          className="cell top-line"
          onClick={handleClick}
        />*/
        <div id={id} className="cell top-line" onClick={handleClick}></div>
      );
    } else {
      elements.push(
        /*<img
          src={element.visual}
          id={id}
          className="cell right-line"
          onClick={handleClick}
        />*/
        <div id={id} className="cell right-line" onClick={handleClick}></div>
      );
    }
  });

  return <div className="board">{elements}</div>;
}
