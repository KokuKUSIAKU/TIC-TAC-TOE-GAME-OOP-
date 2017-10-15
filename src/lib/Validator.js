
import { MESSAGE } from "./PartyMediator";

function Validator() {
  var _rules = [];
  var _mediator = null;

  Object.defineProperty(this, "rules", {
    set: function setRules(rules) {
      _rules.push(...rules);
    },
    get: function getRules() { return _rules; }
  });
  Object.defineProperty(this, "mediator",
    {
      set: function setMediator(mediator) { if (!_mediator) { _mediator = mediator; } },
      get: function getMediator() { return _mediator; },
    });
}
Validator.prototype.registerMediator = function registerMediator(mediator) {
  this.mediator = mediator;
};

Validator.prototype.excute = function excute(action) {
  this[action].apply(this, [].slice.call(arguments, 1));
};

Validator.prototype.send = function send(message, receiver) {
  receiver.receive(message, this, arguments[2]);
}; 

Validator.prototype.check = function check(rules, position) {
  console.log("rules", rules);
  return rules.every(rule => rule(position[0]));
};
Validator.prototype.VALIDATE = function validate(position) {
  let _result = this.check(this.rules, position);
  if (_result) { this.send(MESSAGE.ACCEPT, this.mediator, position); }
  else { this.send(MESSAGE.REJECT, this.mediator, position); }
};

export default Validator;