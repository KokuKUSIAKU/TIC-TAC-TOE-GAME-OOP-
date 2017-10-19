import Validator from "./Validator";

var count = 3;
var TicTacToeReferee = new Validator();
TicTacToeReferee.rules = [columnTest, lineTest, nDiagonalTest, pDiagonalTest];

function filterCells( cells ) {
  return cells.filter(cell => cell && cell.children[0].innerHTML); 
}
function lineTest({ column, target }) {
  var td = target.parentNode;
  var ln; 
  var cells = Array.from(td.parentNode.children).slice(column - count < 0 ? 0 : column - count + 1, column + count);
  var checkList = [];
  cells = filterCells(cells); 
  ln = cells.length;
  if (ln < count) { return true; }
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some(list => list.every(content => content.innerHTML === td.innerHTML));
}

function columnTest({ row, column, target }) {
  var checkList = [];
  var ln;
  var td = target.parentNode;
  var table = td.parentNode.parentNode;
  var cells = (Array.from(table.children)).map(_row => _row.children[column]);
  cells = cells.slice(row - count < 0 ? 0 : row - count + 1, row + count);
  cells = filterCells(cells); 
  ln = cells.length;
  if (ln < count) { return true; }
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some(list => list.every(content => content.innerHTML === td.innerHTML));
}

function pDiagonalTest({ row, column, target }) {

  var checkList = [];
  var ln;
  var td = target.parentNode;
  var table = td.parentNode.parentNode;
  var cells = (Array.from(table.children)).map(function (_row, index) {
    if (index <= row) { return _row.children[column + row - index]; }
    else { return _row.children[column + index - row]; }
  });
  cells = cells.slice(row - count < 0 ? 0 : row - count + 1, row + count);
  cells = filterCells(cells); 
  ln = cells.length;
  if (ln < count) { return true; }
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some(list => list.every(content => content.innerHTML === td.innerHTML));
}
function nDiagonalTest({ row, column, target }) {
 
  var checkList = [];
  var ln;
  var td = target.parentNode;
  var table = td.parentNode.parentNode;
  var cells = (Array.from(table.children)).map(function (_row, index) {
    if (index <= row) { return _row.children[column - row + index]; }
    else { return _row.children[column + row - index]; }
  });
  cells = cells.slice(row - count < 0 ? 0 : row - count + 1, row + count);
  cells = filterCells(cells); 
  ln = cells.length;
  if (ln < count) { return true; }
  for (let i = 0; i <= ln - count; i++) {
    checkList.push(cells.slice(i, i + count));
  }
  return !checkList.some(list => list.every(content => content.innerHTML === td.innerHTML));
}


export default TicTacToeReferee; 