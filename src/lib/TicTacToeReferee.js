import Validator from "./Validator";

var count = 3;
var TicTacToeReferee = new Validator();
TicTacToeReferee.rules = [lineTest, columnTest];

function lineTest(position) {

  function checkRight({ target }) {
    var index = 1;
    var node = target.parentNode;
    var html = node.innerHTML;
    while (node && index < count) {
      node = node.nextSibling;
      if (!node || node.innerHTML != html) { return false; }
      index++;
    }
    return true;
  }

  function checkLeft({ target }) {
    var index = 1;
    var node = target.parentNode;
    var html = node.innerHTML;
    while (node && index < count) {
      node = node.previousSibling;
      if (!node || node.innerHTML != html) { return false; }
      index++;
    }
    return true;
  }
  return checkLeft(position) || checkRight(position);
}

function columnTest(position) {

  function checkDown({ column, target }) {
    var td = target.parentNode;
    var html = td.innerHTML;
    var row_ = td.parentNode;
    var index = 1;

    while (row_ && index < count) {
      row_ = row_.nextSibling;
      if (!row_|| row_.children[column].innerHTML != html) { return false; }
      index++;
    }
    return true;
  }

  function checkUp({ column, target }) {
    var td = target.parentNode;
    var html = td.innerHTML;
    var row_ = td.parentNode;
    var index = 1;

    while (row_ && index < count) {
      row_ = row_.previousSibling;
      if (!row_|| row_.children[column].innerHTML != html) { return false; }
      index++;
    }
    return true;
  }

  return checkDown(position) || checkUp(position);

}

function pDiagonalTest(player) {
  // check if the player has  aligned 3 symbol diagonally (first)
  if (player.position.line == player.position.column) {

    if (this.table[0][0] != "0" && this.table[0][0] == this.table[1][1] && this.table[1][1] == this.table[2][2]) {
      player.attribute = this.state.win;
    }
  }
}
function nDiagonalTest(player) {
  // check if the player has  aligned 3 symbol diagonally (second) 
  if (player.position.line == 2 - player.position.column) {

    if (this.table[0][2] != "0" && this.table[0][2] == this.table[1][1] && this.table[2][0] == this.table[1][1]) {
      player.attribute = this.state.win;
    }
  }
}


export default TicTacToeReferee; 