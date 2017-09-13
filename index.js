
import React from "react";
import ReactDOM from "react-dom";

module.exports = (function () {
  var { render } = ReactDOM;

  var settings = {
    _DIM: 3,
    _bt: {},
    _layout: [],
  };

  var events = {

  }

  function addEvent(event) {
    // error in case events contain already the disered event
    // check also it is really javascript event
    events = Object.assign({}, events, event)
  }


  //var  _layout  = settings._layout;
  /*
   HELPER FUNCTIONS 
  */

  // this create a non extensible react component
  function GameLayout() { };

  GameLayout.CreateButton = function createButton() {
    settings._bt = <button className="bt"></button>;
    return this;
  }

  //settings._bt = createButton(); // button create step 1
  // add not played proptotype 
  GameLayout.ButtonNotPlayed = function ButtonNotPlayed() {};
  GameLayout.ButtonNotPlayed.props = {
    onClick: function buttonClick() {
      console.log(" I have been clicked")
    }
  }

  GameLayout.addButtonNotPlayedProps = function addButtonNotPlayedProps() {
    // need to make sure normally settings._bt doesn't have the props normaly
    console.log(settings);
    var _bt,
      newProps = GameLayout.ButtonNotPlayed.props,
      _props = Object.assign({}, settings._bt.props, newProps);
    _bt = Object.assign({}, settings._bt, { props: _props });
    settings._bt = Object.assign({}, _bt);
    return this;
    // return _bt; 
  }

  //console.log(createButton());

  //create All layout actually 

  function ButtonBeingPlayed() { };
  ButtonBeingPlayed.props = {
    onClick: function clicked() {
      console.log(" Bien played clicked")
    }

  }

  function addButtonPlayedProps() {

  }
  //console.log(settings._layout)
  // add the event to all the game board button 

  GameLayout
  .CreateButton()
  .addButtonNotPlayedProps(); 


  // create single game board for the tic-tac-toe; 
  var SingleBoard = (function CreateSingleGameBoard() {
    var _board;
    const _bt = settings._bt;

    function initialise2DBoard() {
      var _2DBoard = [];
      for (var i = 0; i < settings._DIM; i++) {
        _2DBoard.push([]);

        for (var j = 0; j < settings._DIM; j++) {
          _2DBoard[i].push(Object.assign({}, _bt));
        }

      }
      /* enforce new here to make sure this doesn't point to window or gloabl object */
      return _2DBoard;
    }


    return function initialiseSingleBoard() {
      if (!_board) {
        _board = initialise2DBoard();
      }
      return _board;
    };

  })();

  settings._layout = SingleBoard();
  console.log(settings._layout);
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

  //console.log("here", settings._layout);
  //make all object inherit form Button notclicked here
  //console.log(settings._button);



  //settings._button.prototype = ButtonNotPlayed.prototype; 
  //setting._button.onClick = this.clickEvent; 



  //var _layout = settings._layout[0][0]
  render(
    <table>
      <tbody>
        {wrapLayoutNicely()}
      </tbody>
    </table>,
    document.getElementById("app")
  );
})(); 