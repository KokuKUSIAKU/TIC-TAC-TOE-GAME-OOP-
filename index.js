
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
<<<<<<< HEAD
  var view = new CreateTable(); 
  console.log(view);
=======
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

  })();


  /****************************************************************
  *
  *    PLAYERS 
  */

  function Player() { 
    var _symbol = "";
    Object.defineProperty(this, "symbol",
      {
        set: function setSymbol(symbol) { _symbol = symbol; },
        get: function getSymbol() { return _symbol; }
      });
  }

  Player.prototype = {
    update: function () {
      const ctx = this;
      return this.select().then(function onFulfilled(element) {
        var _p = new Promise(function resolver(res) {

          render(
            ctx.symbol,
            element
          );
          res(element);
        });
        return _p;
      });
    },
    play: function play() {
      return this.update(this._gameboard, this._symbol);
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
      var gameBoardButtons = [], index;
      Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
        Array.from(line.children).forEach(function gameCell(cell) {
          gameBoardButtons.push(cell.children);
        });
      });
      while (!index) {
        let _index = parseInt(Math.random() * gameBoardButtons.length);
        if (!gameBoardButtons[_index][0].children[0]) { index = _index; }
      }

      setTimeout(function personSelect() {
        resolve(gameBoardButtons[index][0]);
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
        resolve(e.target);
      }
      gameBoard.addEventListener("click", clickHandler, { once: true });
    });
  };

  /*
   *
   * Match and Party
   *
   */

  function Party(players, rules) {
    const _players = players;
    const _rules = rules;
    Object.defineProperty(this, "players", { get: function getPlayers() { return _players; } });
    Object.defineProperty(this, "rules", { get: function getRules() { return _rules; } });
  }

  Party.prototype.run = function runParty() {
    const ctx = this; 
    return this.players.reduce(function (promise, player) {
      return promise.then(function onFulfilled() {
        return player.play().then(element => ctx.rules.check(element));
      });
    }, Promise.resolve());
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
    var gameBoardButtons = [];
    Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
      Array.from(line.children).forEach(function gameCell(cell) {
        gameBoardButtons.push(cell.children);
      });
    });
  }; 

  Match.prototype.parties = function* parties() {
    let _number = 0;
    while (!this.winner) {
      yield new Party(this.players, {check:function() { console.log("check rules");}});
      if (_number == 1) { this.winner = true; }
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
  person.symbol = React.createElement("p", { children: "Person" }); 
  computer.symbol = React.createElement("p", { children: "Computer" });
  var TICTACTOE = new Match([person, computer]);
  TICTACTOE.run();
>>>>>>> master

})();

