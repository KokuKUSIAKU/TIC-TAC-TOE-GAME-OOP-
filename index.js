import React from "react";
import ReactDOM from "react-dom";

(function () {
  var { render } = ReactDOM;

  var APP = APP || {}; 
  APP.Game = APP.Game || {};
  APP.Game.View = (function GameView( dim = 3 ) {
    var _dim = dim;
    // build a function that construction automatically the table with just
    // few argument, dimension of the table and the content of a cell 

    function createButton() {
      return <button className="bt"></button>;
    }

    /**
     * @function createTableCell
     * @param {*} component a valid react UI component
     * @return a react td UI component with the parameter component as child
     */

    function creatTableCell( component ) {
      // not main, footer, aside, header, all h* elements
      return React.createElement( "td", { className: "tb-cell" }, component );
    }

    /**
     * @function createTableRow
     * @param {*} component component a valid react UI component
     * @return a react tr component 
     * @private
     * 
     */

    function createTableRow( component ) {
      //component = component.map(element => )
      // checking that component function should return a td component
      return React.createElement( "tr", { className: "tb-cell" }, component );
    } 

    /**
     * @function createViewTable
     * 
     */

    function createTable( fns, init, dim = 1 ) {
      //var listFunction = [ creatTableCell, createViewRow];

      if (!Array.isArray( fns )) {
        throw ( "Type Error: Invalid first argument. Expecting an array" );
      }

      fns.forEach(
        fn => {
          if ( typeof fn !== "function" ) {
            throw ( "Type Error: Invalid element in first argument (array): " +
            "it should contain only function elements" );
          }
        });

      if ( init === "undefined" || typeof init !== "function" ) {
        init = () => {};
      }

      /**
     * @function createArray
     * @param { Number } dim the lenght of return array
     * @param { Function || class } component a react component type 
     * @return { Array } an array of react component constructor function 
     * @private
     */
      function createArray( dim, component ) {
        if (!React.isValidElement( component )) {
          const message = "Type error: second argument should be a valid react component constructor," +
            " function preferably";
          throw ( message );
        }

        return (new Array( dim )).fill( 1 ).map(( val, index ) => React.cloneElement(
          component,
          { key: index }
        ));
      }


      return fns.reduce(( prev, next ) => createArray( dim, next( prev )), init());
    }

    //var _table = createTable([creatTableCell,createTableRow], createButton, _dim);
    //console.log(test);

    render(
      <table>
        <tbody>
          { createTable([creatTableCell,createTableRow], createButton, _dim ) }
        </tbody>
      </table>,
      document.getElementById("app")
    );
  })();



})();

