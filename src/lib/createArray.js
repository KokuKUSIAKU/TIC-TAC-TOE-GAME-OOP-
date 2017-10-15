import React from "react";

function createArray(dim, component) {
  return (new Array(dim)).fill(1).map((val, index) => React.cloneElement(
    component,
    { key: index, 
      "data-index":index
    }
  ));
}

export default createArray;

