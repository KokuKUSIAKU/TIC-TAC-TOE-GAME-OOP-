
// Hello Welcome to my Tic-Tac-Toe Game code
// Couple of things: 
// 1 - It is not built following any Game development standards, just having great fun with Javascript
// 2 - It is overkill intentionnally in many ways probably.
// 3 - Any comment on efficiency or perfomance issues not about the game but about JS is very welcome 

import React from "react";
import ReactDOM from "react-dom";
import CreateTable from "./src/lib/createTable";

(function () {
  var { render } = ReactDOM;
  var gameBoard = document.getElementById("app");
  var view = new CreateTable(); 
  console.log(view);

})();

