
import { MESSAGE } from "./PartyMediator";

var gameBoard = document.getElementById("app");

function Player() {
  var _symbol = "";
  var _gameBoard = null;
  //var _mediator = null;

  Object.defineProperty(this, "game",
    {
      set: function setGameBoard(gameBoard) { if (!_gameBoard) { _gameBoard = gameBoard; } },
      get: function getGameBoard() { return _gameBoard; },
    });
  Object.defineProperty(this, "symbol",
    {
      set: function setSymbol(symbol) { _symbol = symbol; },
      get: function getSymbol() { return _symbol; }
    });

}

Player.prototype.joinGameBoard = function joinGameBoard(gameBoard) {
  this.game = gameBoard;
};

Player.prototype.send = function send(message, receiver) {
  receiver.excute(message, this, arguments[2]);
};

Player.prototype.PLAY = function play(requestor) {
  return this.select(requestor);
};

Player.prototype.excute = function excute(message, from) {
  this[message].call(this, from, [].slice.call(arguments, 2));
};


function Computer() { }
Computer.prototype = new Player;
Computer.prototype.constructor = Computer;
Computer.prototype.select = function (requestor) {
  var _tbody = gameBoard.children[0].children[0];
  var position = {
    row: parseInt(Math.random() * this.game._length()),
    column: parseInt(Math.random() * this.game._length())
  };
  position.target = _tbody.children[position.row].children[position.column].children[0];
  //return position;

  this.send(MESSAGE.PLAYED, requestor, position);
};


function Person() { }
Person.prototype = new Player;
Person.prototype.constructor = Person;

Person.prototype.select = function (requestor) {
  const ctx = this;
  function clickHandler(e) {
    var target = e.target.parentNode;
    var [targetIndex, parentIndex] = [parseInt(target.dataset.index), parseInt(target.parentNode.dataset.index)];
    ctx.send(MESSAGE.PLAYED, requestor, { row: parentIndex, column: targetIndex, target: e.target });
  }
  gameBoard.addEventListener("click", clickHandler, { once: true });
};

export { Person, Computer, Player };
//export default Player;