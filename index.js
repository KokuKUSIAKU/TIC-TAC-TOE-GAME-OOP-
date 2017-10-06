
// Hello Welcome to my Tic-Tac-Toe Game code
// Couple of things: 
// 1 - It is not built following any Game development standards, just having great fun with Javascript
// 2 - It is overkill intentionnally in many ways probably.
// 3 - Any comment on efficiency or perfomance issues not about the game but about JS is very welcome 

import React from "react";
import ReactDOM from "react-dom";

(function () {
  var { render } = ReactDOM;
  var gameBoard = document.getElementById("app");
  var view;

  view = (function GameView(dim = 3) {
    var _dim = dim;

    function createButton() {
      return React.createElement("button", { className: "bt" });
    }

    /**
     * @function createTableCell
     * @param {*} component a valid react UI component
     * @return {*} a react td UI component with the parameter component as child
     */

    function creatTableCell(component) {
      // not main, footer, aside, header, all h* elements
      return React.createElement("td", { className: "tb-cell" }, component);
    }

    /**
     * @function createTableRow
     * @param {*} component component a valid react UI component
     * @return a react tr component 
     * 
     */

    function createTableRow(component) {
      return React.createElement("tr", { className: "tb-cell" }, component);
    }

    /**
     * @function createViewTable create a  ***2 dimensional html square table***  
     * @param { Array } fns an array of functions 
     * @param { Function } init a function to initialise the component 
     * @param { Number } dim a initeger, defaut is 1, the number in each row of the table as 
     * 
     */

    function createTable(fns, init, dim = 1) {
      if (!Array.isArray(fns)) {
        throw ("Type Error: Invalid first argument. Expecting an array");
      }

      fns.forEach(
        fn => {
          if (typeof fn !== "function") {
            throw ("Type Error: Invalid element in first argument (array): " +
              "it should contain only function elements");
          }
        });

      if (init === "undefined" || typeof init !== "function") {
        init = () => { };
      }

      /**
     * @function createArray
     * @param { Number } dim the length of return array
     * @param { Object } component a react valid component type 
     * @return { Array } an array of react component 
     */
      function createArray(dim, component) {
        if (!React.isValidElement(component)) {
          const message = "Type error: second argument should be a valid react component";
          throw (message);
        }

        return (new Array(dim)).fill(1).map((val, index) => React.cloneElement(
          component,
          { key: index }
        ));
      }


      return fns.reduce((prev, next) => createArray(dim, next(prev)), init());
    }

    render(
      <table>
        <tbody>
          {createTable([creatTableCell, createTableRow], createButton, _dim)}
        </tbody>
      </table>,
      gameBoard
    );
    /**
     * @function update
     * @param {*} target DOM node , actually to cell to update with the player symbol
     * @param {*} element DOM node to be appended to target 
     */
    function update(parent, childElement) {
      render(
        childElement,
        parent
      );
    }
    function callController(controller, e) {
      return controller(e.target);
    }

    function addClickEvent() {
      return gameBoard.addEventListener("click", callController, { once: true });
    }

    // all this need optimisation, caching,
    function _indexOf(target) {
      var gameBoardButtons = Array.from(gameBoard.children[0].children[0].children);
      var ln = gameBoardButtons.length;
      for (let index in gameBoardButtons) {
        for (let td of gameBoardButtons[index].children) {
          if (td.children[0] == target) {
            return index * ln + Array.from(gameBoardButtons[index].children).indexOf(td);
          }
        }
      }
      return -1;
    }
    function _length() {
      return _dim * 2;
    }


    return {
      update: update,
      addClickEvent: addClickEvent,
      _indexOf: _indexOf,
      _length: _length
    };

  })();


  /****************************************************************
  *
  *    PLAYERS 
  */

  function Player() {
    // there is no control on symbol; make sure to assign a valid react component as symbol; 
    var _symbol = "";
    Object.defineProperty(this, "symbol",
      {
        set: function setSymbol(symbol) { _symbol = symbol; },
        get: function getSymbol() { return _symbol; }
      });
  }
  Player.prototype = {
    play: function play() {
      return this.select().then(function onFulfilled(target) {
        return Promise.resolve(target.position);
      });
    }
  };

  /**
  * 
  *********************************************************/
  function Computer() { }
  Computer.prototype = new Player;
  Computer.prototype.constructor = Computer;
  Computer.prototype.select = function () {
    return new Promise(function resolver(resolve) {
      setTimeout(function personSelect() {
        resolve({ position: parseInt(Math.random() * view._length()) });
      }, 1000);
    });
  };

  /**
   * 
   *********************************************************/
  function Person() { }
  Person.prototype = new Player;
  Person.prototype.constructor = Person;
  Person.prototype.select = function () {
    return new Promise(function resolver(resolve) {
      function clickHandler(e) {
        e.target.position = view._indexOf(e.target);
        resolve(e.target);
      }
      gameBoard.addEventListener("click", clickHandler, { once: true });
    });
  };

  /****************************************
   * Match and Party
   ***************************************/
  function Party(players, rules) {
    const _players = players;
    const _rules = rules;
    console.log(_rules);
    Object.defineProperty(this, "players", { get: function getPlayers() { return _players; } });
    Object.defineProperty(this, "rules", { get: function getRules() { return _rules; } });
  }

  Party.prototype.run = function runParty() {
    const ctx = this;
    return this.players.reduce(function (promise, player) {
      return promise.then(function onFulfilled() {
        return ctx.controller(player);
      });
    }, Promise.resolve());
  };

  Party.prototype.controller = function controlParty(currentPlayer) {
    var ctx = this;
    return currentPlayer.play().then(function onFulfilled(position) {
      return ctx.validator(position).then(function onFulfilled(node) {
        view.update(node, currentPlayer.symbol);
        return Promise.resolve(position); // need to wait till this resolved
      }, function onFulfilled() {
        return controlParty(currentPlayer); // need to wait till this resolved
      });
    });
  };

  Party.prototype.validator = function valide(position) {
    var gameBoardButtons = [];
    Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
      Array.from(line.children).forEach(function gameCell(cell) {
        gameBoardButtons.push(cell.children);
      });
    });

    if (!gameBoardButtons[position][0].children[0]) {
      return Promise.resolve(gameBoardButtons[position][0]);
    }
    else {
      return Promise.reject(position);
    }
  };





  /**
   * 
   * Match ; 
   */

  function Match(players) {
    var _winner = null;
    const _players = players;
    Object.defineProperty(this, "winner", {
      get: function getWinner() { return _winner; },
      set: function setWinner(winner) { _winner = winner; }
    });
    Object.defineProperty(this, "players", { get: function getPlayers() { return _players; } });
  }
  Match.prototype.addSymbolToPlayer = function (player, symbol) {
    player.symbol = symbol;
  };
  Match.prototype.controller = function controller() {
    // copy from computer, now for dev, factorise later; 
    var gameBoardButtons = [];
    // a bit long all these children !!! -move this to a function and cached it !
    Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
      Array.from(line.children).forEach(function gameCell(cell) {
        gameBoardButtons.push(cell.children);
      });
    });

    // need robust iterator here 


  };

  Match.prototype.parties = function* parties() {
    let _number = 0;
    while (!this.winner) {
      yield new Party(this.players, { check: function () { console.log("check rules"); } });
      if (_number == 1) { this.winner = true; }
      console.log(_number, this.winner);
      _number++;

    }
    return this.winner;
  };

  // messing, need review & refactorisation !!!! 
  // check the stack !!
  Match.prototype.run = function run() {
    var _parties = this.parties();
    function runParties({ value, done }) {
      if (done) return Promise.resolve({ value, done }).then(() => console.log("Match finished"));
      return Promise.resolve({ value, done }).then(function onFulfilled(res) {
        return Promise.all([res.value.run(), _parties.next(res)]).then(([prev, next]) => runParties(next));
      }).catch(function onrejected(reason) {
        return runParties(_parties.throw(reason));
      });

    }

    try {
      return runParties(_parties.next());
    } catch (err) {
      return Promise.reject(err);
    }

  };

  // some tests - coding continue 
  var person = new Person();
  var computer = new Computer();
  person.symbol = React.createElement("p", { children: "Person" }); // replace with font item 
  computer.symbol = React.createElement("p", { children: "Computer" });
  var TICTACTOE = new Match([person, computer]);
  TICTACTOE.run();

  /*
Game.prototype.lineTest = function(player){
  // check if the player has  aligned 3 symbol horizontally
  if(this.table[player.position.line].join('')==player.symbol.repeat(this.dim)){
    player.attribute =this.state.win;
  }
};

Game.prototype.columnTest = function(player){
  // check if the player has  aligned 3 symbol vertically
var columnIndex = player.position.column;  
if(this.table[0][columnIndex]!="0" && this.table[0][columnIndex]==this.table[1][columnIndex] && this.table[0][columnIndex]==this.table[2]   [columnIndex]){
    player.attribute =this.state.win;
  }
};

Game.prototype.positiveDiagonalTest = function(player){
  // check if the player has  aligned 3 symbol diagonally (first)
  if(player.position.line==player.position.column) {
   
       if (this.table[0][0]!="0" && this.table[0][0]==this.table[1][1] && this.table[1][1]==this.table[2][2]) {
           player.attribute =this.state.win;
       }
   }
};

Game.prototype.negativeDiagonalTest = function(player){
  // check if the player has  aligned 3 symbol diagonally (second) 
   if(player.position.line==2-player.position.column) {
     
      if (this.table[0][2]!="0" && this.table[0][2]==this.table[1][1] && this.table[2][0]==this.table[1][1]){
         player.attribute =this.state.win;
    }
  }
};

  */

})();

