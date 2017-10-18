import React from "react";
import { createStore } from "redux";
import reducer from "./board";

const dim = 3;
const board = Array(dim).fill(undefined).map(
  () => Array(dim).fill(undefined).map(() => React.createElement("button", { className: "bt" })));

const defaultState = {
  board
};
console.log(defaultState);

const store = createStore(reducer, defaultState);
console.log("store", store);
export default store; 