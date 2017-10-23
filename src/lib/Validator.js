
import { MESSAGE } from "./PartyMediator";

function Validator() {
  var _rules = [];
  Object.defineProperty(this, "rules", {
    set: function setRules(rules) {
      _rules.push(...rules);
    },
    get: function getRules() { return _rules; }
  });

}

Validator.prototype.excute = function excute(message,  from) {
  this[message].call(this, from, ...[].slice.call(arguments, 2));
};

Validator.prototype.send = function send(message, receiver) {
  receiver.excute(message, this, arguments[2]);
}; 

Validator.prototype.check = function check(rules, position) {
  return rules.every(rule => rule(position[0]));
};
Validator.prototype.VALIDATE = function validate(requestor,position) {
  let _result = this.check(this.rules, position);
  if (_result) { this.send(MESSAGE.ACCEPT, requestor, position); }
  else { this.send(MESSAGE.REJECT, requestor, position); }
};

export default Validator;