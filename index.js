
import React from "react";
import ReactDOM from "react-dom";
// use before, after, body structured programming approach to initialise 
// the game, in javascript this corresponds to try-catch-finally structure 
module.exports = (function () {
  var { render } = ReactDOM;

  var settings = {
    _DIM: 3,
    _bt: {},
    _layout: []
  };

  /*
    UTILITY FUNCTIONS
  */
  function Observer() {
    this.observers = [];
  }

  Observer.prototype.add = function ( obj ) {
    return this.observers.push(obj);
  };
  Observer.prototype.notify = function ( param ) {
    //console.log("fired");
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i].update( param );
    }
  };

  /*
   HELPER FUNCTIONS 
  */

  function createButton() {
    return <button className="bt"></button>;
  }

  settings._bt = createButton(); // step one ; 

  var myObject = {
    update: function () {
      console.log("fired");
    }
  };

  var SingleBoard = (function CreateSingleGameBoard() {
    var _board;
    const _bt = settings._bt;
    var _props;

    function initialise2DBoard() {

      var _2DBoard = [];
      // check to reduce the looping   
      for (let i = 0; i < settings._DIM; i++) {
        _2DBoard.push([]);

        for (let j = 0; j < settings._DIM; j++) {

          let _object = new Observer();
          let _subject = Object.create(Observer.prototype);

          _2DBoard[i].push(Object.assign(_subject, _object, _bt));
          _props = Object.assign({}, _2DBoard[i][j].props,{onClick: function () {_2DBoard[i][i].notify(); }});
          _2DBoard[i][j] = Object.assign(_2DBoard[i][j], { props: _props });
        
        }

      }

      return _2DBoard;
    }

    return function initialiseSingleBoard() {
      if (!_board) {
        _board = initialise2DBoard();
      }
      return _board;
    };

  })();

  settings._layout = SingleBoard(); // step two ; 
  settings._layout.forEach(function(line) {
    line.forEach(function(bt) {bt.add(myObject);});
  }); // step three 
 

  /*
   wrapLayoutNicely helps separate model from view
  */
  function wrapLayoutNicely() {
    //onsole.log(settings._layout);
    var wrappeLayout = settings._layout.map((line, i) => <tr key={i}>{
      line.map((button, j) => <td key={[i, j].join("")}> {button}</td>)
    }</tr>);
    return wrappeLayout;
  }

  render(
    <table>
      <tbody>
        { wrapLayoutNicely() }
      </tbody>
    </table>,
    document.getElementById("app")
  );
})(); 