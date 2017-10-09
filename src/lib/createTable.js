import React from "react";

/**
 * @param {Function|Class} component a valid react component a function or class 
 * @param {Number} [collums a positive safe integer: the number of the table collums 
 * @param {Number} [rows=1] a positive safe integer: the number of the table rows, defaut value is one 
 */

function CreateTable(collums = 1, rows = 1, component = null) {
  var _tableContent = {};
  //var _cellsContentRef = [];
  var _table = React.createElement("table", { className: "tb" });
  var _tbody = React.createElement("tbody", { className: "tbody" });

  Object.defineProperty(this, "content", {
    set: function addCellContent(component) {
      _tableContent.forEach((row) => row.props.children.forEach(cell => cell.props.children = component));
    }
  });

  _table.props = Object.create({}, {children:_tbody});
  _tbody.props = Object.create({}, {children:_tableContent});
/*
  _tableContent.push(
    (new Array(rows))
      .fill(1)
      .map(() => React.createElement("tr", { className: "tr" }))
  );

  _tableContent.forEach((row) => row.props.children.push(
    (new Array(collums))
      .fill(1)
      .map(() => React.createElement("td", { className: "td" }, component))
  ));

  _tableContent.forEach(function (row, rowIndex) {
    row.forEach(function (content, contentIndex) {
      _cellsContentRef.push(
        { 
          index: rowIndex*collums+contentIndex,
          value:content
        });
    });
  });
*/
  return _table;

}

export default CreateTable;

