import Validator from "./Validator";

var count = 3;
var TicTacToeReferee = new Validator();
TicTacToeReferee.rules = [columnTest,lineTest];

function lineTest({column, target }) {
  var td = target.parentNode; 
  var cells = Array.from(td.parentNode.children).slice(column - count < 0 ? 0 : column - count + 1, column + count);
  var checkList = [];
  var ln = cells.length;
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some( list => list.every( content => content.innerHTML === td.innerHTML));
}

function columnTest({row, column, target}) {
  var checkList = [];
  var ln ; 
  var td = target.parentNode; 
  var table = td.parentNode.parentNode; 
  var cells  = (Array.from(table.children)).map( _row => _row.children[column]); 
  cells = cells.slice(row - count < 0 ? 0 : row - count + 1, row + count);
  ln  = cells.length;
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some( list => list.every( content => content.innerHTML === td.innerHTML));
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