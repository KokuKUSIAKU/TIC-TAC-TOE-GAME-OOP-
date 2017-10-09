import React from "react";
import ReactDOM from "react-dom";

(function () {
  var { render } = ReactDOM;
  var gameBoard = document.getElementById("app");
  var view;

  view = (function GameView(dim = 3) {
    var _dim = dim;

    function createButton() {
      //return <button className="bt" />;
      return React.createElement("button", { className: "bt" });
    }
    /**
    * @function create2DArray
    * @param { Number } dim the length of return array
    * @param { Object } component a react valid component type 
    * @return { Array } an array of react component 
    */

   /* function create2DArray(dim, component) {
      if (!React.isValidElement(component)) {
        const message = "Type error: second argument should be a valid react component";
        throw (message);
      }
      return (new Array(dim)).fill(1).map((val, index) => React.cloneElement(
        component,
        { key: index }
      ));
    }
*/
    /**
     * @function createViewTable create a  ***2 dimensional html square table***  
     * @param { Array } fns an array of functions 
     * @param { Function } init a function to initialise the component 
     * @param { Number } dim a initeger, defaut is 1, the number in each row of the table as 
     * 
     */

    function createTable(cellElement, dim = 1) {
      return (
        <table>
          <tbody>
          </tbody>
        </table>

      );

    }

    render(
      <table>
        <tbody>
          {createTable([createTableCell, createTableRow], createButton, _dim)}
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
