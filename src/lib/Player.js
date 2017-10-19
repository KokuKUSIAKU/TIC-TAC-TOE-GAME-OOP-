
import { MESSAGE } from "./PartyMediator";

var gameBoard = document.getElementById("app"); 

function Player() {

  var _symbol = "";
  var _gameBoard = null;
  var _mediator = null;

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

  Object.defineProperty(this, "mediator",
    {
      set: function setMediator(mediator) { if (!_mediator) { _mediator = mediator; } },
      get: function getMediator() { return _mediator; },
    });
}

Player.prototype.joinGameBoard = function joinGameBoard(gameBoard) {
  this.game = gameBoard;
};

Player.prototype.registerMediator = function registerMediator(mediator) {
  this.mediator = mediator;
};

Player.prototype.send = function send(message, receiver) {
  receiver.receive(message, this, arguments[2]);
};

Player.prototype.PLAY = function play() {
  return this.select(this.game);
};

Player.prototype.excute = function excute(action) {
  this[action].apply(this, [].slice.call(arguments, 1));
};


function Computer() { }
Computer.prototype = new Player;
Computer.prototype.constructor = Computer;
Computer.prototype.select = function () {
  var _tbody = gameBoard.children[0].children[0]; 
  var position = {
    row: parseInt(Math.random() * this.game._length()),
    column: parseInt(Math.random() * this.game._length())
  };
  position.target = _tbody.children[position.row].children[position.column].children[0];
  this.send(MESSAGE.PLAYED, this.mediator, position);
};


function Person() { }
Person.prototype = new Player;
Person.prototype.constructor = Person;

Person.prototype.select = function () {

  const ctx = this;

  function clickHandler(e) {
    var target = e.target.parentNode;
    var [targetIndex, parentIndex] = [parseInt(target.dataset.index), parseInt(target.parentNode.dataset.index)];
    ctx.send(MESSAGE.PLAYED, ctx.mediator, { row: parentIndex, column: targetIndex, target: e.target });
    //return { row: parentIndex, column: targetIndex, target: e.target };
  }
  gameBoard.addEventListener("click", clickHandler, { once: true });
  /*return {
    then: () => gameBoard.addEventListener("click", clickHandler, { once: true })
  };*/
};

export { Person, Computer, Player };
//export default Player;