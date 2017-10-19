// board reducer
import React from "react";

function board(state = [], action) {

  if (action.type == "UPDATE") {
    let newBoard = [...state.board];
    let { row, column, Node } = action.target;
    newBoard[row][column] = React.createElement("button", { className: "bt" }, Node);
    return {
      board:newBoard
    };
  }
  return state;
}

// this only to avoid name shadowing in state.js file; 
const reducer = board;
export default reducer; 