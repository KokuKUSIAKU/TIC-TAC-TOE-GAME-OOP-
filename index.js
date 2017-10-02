// this script is overheaded intentionnally !!
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
      // a bit long all these children !!! 
      Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
        Array.from(line.children).forEach(function gameCell(cell) {
          gameBoardButtons.push(cell.children);
        });
      });

      //let us thrust the player here 
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

  /*
   During a new party, each players can play once, if none realises a winning 
   combinaison before last player
   Party run method allow players to play alternately in the order provided by Match 
  */
  function Party(players) {
    const _players = players;
    Object.defineProperty(this, "players",
      { get: function getPlayers() { return _players; } }
    );
  }

  Party.prototype.run = function runParty() {
    return this.players.reduce(function (promise, player) {
      return promise.then(function onFulfilled() {
        return player.play();
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
    Object.defineProperty(this, "winner",
      {
        get: function getWinner() { return _winner; },
        set: function setWinner(winner) { _winner = winner; }
      }
    );
    Object.defineProperty(this, "players",
      {
        get: function getPlayers() { return _players; }
      });

  }
  Match.prototype.addSymbolToPlayer = function (player, symbol) {
    player.symbol = symbol;
  };
  Match.prototype.parties = function* parties() {
    while (!this.winner) {
      yield new Party(this.players);
    }
    return this.winner;
  };

  Match.prototype.run = function run() {
    // 
    const _match = this.parties();
    var _sequence = _match.next().value.run();
    // recursion to the rescue here to add then on demand, not as with reduce or for loop 
    _sequence.then(function onFulfilled() {
      //console.log(data);
      // someone is right, promises are the vampires of programming except they don't know what is called sun !!!
      return _match.next().value.run();
    });
  };


  // some tests - coding continue 
  var person = new Person();
  var computer = new Computer();
  person.symbol = React.createElement("p", { children: "Person" }); // replace with font item 
  computer.symbol = React.createElement("p", { children: "Computer" });
  var TICTACTOE = new Match([person, computer]);
  TICTACTOE.run();

})();

