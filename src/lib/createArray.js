//import React from "react";
var React = require("react");

/**
 * @function createArray 
 * @param {number} dim a positive integer , the length of the return array. 
 * @param {function|class} component a react component (a function or a class not at JSX synthax component) 
 */

function createArray(dim, component) {
  
  if( !parseInt(dim) && !Number.isSafeInteger(dim) ) { throw (" first argument of createArray should a safe integer");}
  if (!React.isValidElement(component)) { throw (" expect second argument as a valid react component: a function or class"); }
  
  return (new Array(dim)).fill(1).map((val, index) => React.createElement(
    component,
    { key: index }
  ));

}

export default createArray; 

