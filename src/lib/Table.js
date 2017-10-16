import React from "react";
import createArray from "./createArray";

function Table(props)  {
  var { dim } = props;
  function createButton() {
    return React.createElement("button", { className: "bt" });
  }

  function creatTableCell(component) {
    return React.createElement("td", { className: "tb-cell" }, component);
  }

  function createTableRow(component) {
    return React.createElement("tr", { className: "tb-cell" }, component);
  }
  // this generates an aray of tr node with td cells 
  function createTable() {
    return [creatTableCell, createTableRow].reduce((prev, next) => createArray(dim, next(prev)), createButton());
  }

  // change to no-JSX syntax later 
  return (
    <table>
      <tbody>
        {createTable(dim)}
      </tbody>
    </table>
  );
}

export default Table; 