import React from "react";
import { connect } from "react-redux";

function Table(props) {
  return React.createElement(
    "table",
    { className: "table" },
    React.createElement(
      "tbody",
      { className: "tbody" },
      props.board.map((row, rowIndex) => React.createElement(
        "tr",
        { className: "tr", key: rowIndex, "data-index": rowIndex },
        row.map((content, index) => React.createElement(
          "td",
          { className: "td", key: index, "data-index": index },
          content
        ))
      ))
    )
  );
}

function mapStateToProps(state) {
  const board = state.board; 
  return {
    board
  };
}

const TableBoard = connect(
  mapStateToProps
)(Table);

export default TableBoard;