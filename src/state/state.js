import React from "react";
import { createStore } from "redux";
import reducer from "./board";

const dim = 5;
const board = Array(dim).fill(undefined).map(
  () => Array(dim).fill(undefined).map(() => React.createElement("button", { className: "bt" })));

const defaultState = {
  board
};
const store = createStore(reducer, defaultState);
export default store; 