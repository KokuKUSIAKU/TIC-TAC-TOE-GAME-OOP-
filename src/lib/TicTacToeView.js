/* eslint-disable*/
import React from "react";
import ReactDOM from "react-dom";
import Table from "./Table";
import gameBoard from "./gameBoard";
/* eslint-enable */

function tictactoeView() {

  var { render } = ReactDOM;
  var view = (function GameView(dim = 3) {
    var _dim = dim;

    render(
      <Table dim={dim} />,
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
      return _dim;
    }

    function clickEventTarget() {
      var _listeners = [];
      Object.defineProperty(this, "add", {
        set: function addSubject(listener) {
          if (this._listeners.indexOf(listener) != -1) {
            this._listeners.push(listener);
          }
        }
      });
      Object.defineProperty(this, "listeners", {
        get: function getObservers() {
          return _listeners;
        }
      });

    }
    clickEventTarget.notify = function notify(eventTarget) {
      this.listeners.forEach(listener => listener(eventTarget));
    };


    return {
      update: update,
      addClickEvent: addClickEvent,
      clickEventTarget: clickEventTarget,
      _indexOf: _indexOf,
      _length: _length,

    };

  })();
  /*
  gameBoard.addEventListener("click", function (e) {
    view.clickEventTarget.notify(e.target);
  });
  */
  return view;
}

export default tictactoeView; 
