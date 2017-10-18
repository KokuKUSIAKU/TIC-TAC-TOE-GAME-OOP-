// board reducer
import React from "react";
import {combineReducers} from "redux"; 

function board(state = [], action) {
  if(action.type == "UPDATE") {
    let newBoard = [...state]; 
    let { row, column, node} = action; 
    newBoard[row][column] == React.createElement("button", {className:"bt"}, node); 
    return newBoard; 
  }
  return state;
}

// this only to avoid name shadowing in state.js file; 
 const reducer = board; 
/*function reducer(state = [], action) {
  return board(state, action); 
}*/
/*const reducer = combineReducers({
  board
}); */

export default reducer; 