
// this script is overheaded intentionnally !!

import React from "react";
import ReactDOM from "react-dom";

(function () {
  var { render } = ReactDOM;
  var gameBoard = document.getElementById("app");
  var selection = {
    selectByClick: "selectByClick",
    selectByFocus: "selectByFocus"
  };
  var APP = APP || {};
  APP.Game = APP.Game || {};

  function Observer() {
    this.observers = [];
  }

  Observer.prototype.add = function (obj) {
    return this.observers.push(obj);
  };
  Observer.prototype.notify = function (param) {
    console.log("fired");
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i].update(param);
    }
  };


  APP.Game.View = (function GameView(dim = 3) {
    var _dim = dim, _table;

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

  function Player() { }
  /** think about moving update and select method into prototype which may be 
   * a promise wraypper, event a promise wrapper should be a method of player that allow 
   *  a player to wrap any of its normal method into a promise 
  */
  Player.prototype = {
    play: function play() {
      return this.update(this._gameboard); // big promise 
    }
  };

  /**
   * 
   *********************************************************/
  function Computer() { }
  Computer.prototype = new Player;
  Computer.prototype.constructor = Computer;
  Computer.prototype.update = function () {
    //console.log("Comuter updating");
    return this.select().then(function onFulfilled( /*position */) {
      // do something here with position; 
      var _p = new Promise(function (res) {
        setTimeout(function personUpdate() {
          console.log("Computer update promise");
          res();
        }, 1000);
      });
      return _p;

    });
  };
  Computer.prototype.select = function () {
    //console.log("Computer selecting");
    // this.methodes[this.selectType]();
    return new Promise(function resolver(resolve) {
      /*setTimeout(function personSelect() {
        console.log("Person prototype select");
        //this.methodes[this.selectType]();
        resolve();
      }, 1000);*/
      setTimeout(function personSelect() {
        console.log("computer Selection function called");
        resolve();
      }, 1000);
    });
  };

  /**
   * 
   *********************************************************/
  function Person() { }

  Person.prototype = new Player;
  Person.prototype.constructor = Person;
  Person.prototype.update = function () {
    return this.select().then(function onFulfilled(element) {
      var _p = new Promise(function resolver(res) {
        // keep it for development now, 
        // update puting real symbol on the board later
        setTimeout(function personUpdate() {
          element.innerHTML = "You";
          res(element);
        }, 2000);
      });
      return _p;
    });
  };

  // return a promise for a click event to be handle and continue the party 
  Person.prototype.select = function () {
    return new Promise(function resolver(resolve) {
      // keep clickHandler here, though i am not sure it is the right place 
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

  // Party mediator between players 
  function Party(players) {
    const _players = players;
    Object.defineProperty(this, "players",
      { get: function getPlayers() { return _players; } }
    );
  }
  // ok valided 
  Party.prototype.selectNextPlayer = function* selectNextPlayer() {
    var _index = 0, _playerNumber = this.players.length;
    while (_index < _playerNumber) {
      yield this.players[_index];
      _index += 1;
    }
  };

  Party.prototype.run = function runParty() {
    return this.players.reduce(function (promise, player) {
      return promise.then(function onFulfilled(element) {
        // make sure that every player play method return a promise 
        // don't anything for the first player to player 
        if (element !== document) {
          console.log("hehe element played", element);
        }
        return player.play();
      });
    }, Promise.resolve(document));
  };



  // some tests
  var person = new Person();
  var computer = new Computer();

  var myparty = new Party([person, computer]);
  myparty.run();

})();

