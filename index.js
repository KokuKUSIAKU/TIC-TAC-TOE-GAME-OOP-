// Hello Welcome to my Tic-Tac-Toe Game code
// Couple of things: 
// 1 - It is not built following any Game development standards, just having great fun with Javascript
// 2 - It is overkill intentionnally in many ways probably.
// 3 - Any comment on efficiency or perfomance issues not about the game but about JS is very welcome 

import React from "react";
import tictactoeView from "./src/lib/TicTacToeView";
import { Person, Computer} from "./src/lib/Player";
import PartyMediator from "./src/lib/PartyMediator";
import TicTacToeValidator from "./src/lib/TicTacToeValidator";
import TicTacToeReferee from "./src/lib/TicTacToeReferee";
var gameBoard = document.getElementById("app"); 
(function () {

  var gameView = tictactoeView();
  var person = new Person();
  var computer = new Computer();

  // person and computer join the same game but, 
  // person hold the DOM Object while compute hold the game view object
  // to have necessary functionalities
  person.joinGameBoard(gameBoard);
  computer.joinGameBoard(gameView);

  var tictactoeMediator = new PartyMediator();
  var Mediator = tictactoeMediator;
  person.registerMediator(Mediator);
  computer.registerMediator(Mediator);
  TicTacToeValidator.registerMediator(Mediator);
  TicTacToeReferee.registerMediator(Mediator);

  Mediator.add = { type: "PLAYER", participant: person };
  Mediator.add = { type: "PLAYER", participant: computer };
  Mediator.add = { type: "VALIDATOR", participant: TicTacToeValidator };
  Mediator.add = { type: "REFEREE", participant: TicTacToeReferee };
  Mediator.add = { type: "VIEW", participant: gameView };

  person.symbol = React.createElement("i", { className: "fa fa-asterisk", "aria-hidden": "true" });
  computer.symbol = React.createElement("i", { className: "fa fa-dot-circle-o", "aria-hidden": "true" });

  Mediator.init();

})();