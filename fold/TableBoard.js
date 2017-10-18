import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import store from "./state";
import update from "./update";
//import Home from "../components/Home";

function Table(props) {
  return React.createElement(
    "table",
    { className: "table" },
    React.createElement(
      "tbody",
      { className: "tbody" },
      props.board.map((row, rowIndex) => React.createElement(
        "tr",
        { className: "tr", key: rowIndex, "data-row": rowIndex },
        row.map((content, index) => React.createElement(
          "td",
          { className: "td", key: index, "data-column": index },
          content
        ))
      ))
    )
  );
}

function mapDispachToProps(dispatch) {
  return bindActionCreators(update, dispatch);
}

function mapStateToProps(state) {
  console.log(store.getState());
  const board = state.board; 
  return {
    board
  };
}

const TableBoard = connect(
  mapStateToProps
)(Table);

export default TableBoard;