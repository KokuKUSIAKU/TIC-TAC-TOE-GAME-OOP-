import Validator from "./Validator"; 

function hasNoChildNodes({target}) {
  return !target.hasChildNodes();
}

var TicTacToeValidator = new Validator();
TicTacToeValidator.rules = [hasNoChildNodes]; 


export default TicTacToeValidator; 