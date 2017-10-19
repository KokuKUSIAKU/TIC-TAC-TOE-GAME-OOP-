import Validator from "./Validator"; 
// work here on state istead of dom 
function hasNoChildNodes({target}) {
  return !target.hasChildNodes();
}

var TicTacToeValidator = new Validator();
TicTacToeValidator.rules = [hasNoChildNodes]; 


export default TicTacToeValidator; 