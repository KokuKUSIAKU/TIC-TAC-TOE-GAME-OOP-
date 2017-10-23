import update from "../state/update";
import store from "../state/state";

/****************************************
 * Match and PartyMediator
 ***************************************/
const PLAY_LIMIT = 25; // just for 3x3 board now 

const MESSAGE = {
  PLAY: "PLAY",
  PLAYED: "PLAYED",
  CONTINUE: "CONTINUE",
  STOP: "STOP",
  WINNED: "WINNED",
  ACCEPT: "ACCEPT",
  REJECT: "REJECT",
  VALIDATE: "VALIDATE"
};

function PartyMediator() {
  const ctx = this; 
  const FUNCTION_REGISTRY = {
    PLAYER: ctx.addPlayer, 
    VALIDATOR: ctx.addValidator,
    VIEW: ctx.addView,
    REFEREE:ctx.addReferee,
  };
  var _currentPlayer = null;
  var _participants = {
    players: [],
    validator: null,
    referee: null,
    view: null
  };

  this.count = 1;

  Object.defineProperty(this, "players", { get: function getPlayers() { return _participants.players; } });
  Object.defineProperty(this, "currentPlayer",
    {
      get: function getCurrentPlayers() { return _currentPlayer; },
      set: function setCurrentPlayers(player) { _currentPlayer = player; }
    });
  Object.defineProperty(this, "validator",
    {
      get: function getValidator() { return _participants.validator; },
      set: function setValidor (validator) { _participants.validator = validator;}
    });
  Object.defineProperty(this, "view",
    {
      get: function getView() { return _participants.view; },
      set: function setView(view) { _participants.view = view;}
    });
  Object.defineProperty(this, "referee",
    {
      get: function getReferee() { return _participants.referee; },
      set: function setReferee(referee) { _participants.referee = referee;}
    });
  Object.defineProperty(this, "add",
    {
      set: function addParticipant({ type, participant }) {
        FUNCTION_REGISTRY[type].call(this, participant); 
      }
    });
}

PartyMediator.prototype.addPlayer = function addPlayer(player) {
  this.players.push(player);
  this.last = player;
};

PartyMediator.prototype.addReferee = function addReferee(referee) {
  this.referee = referee;
};

PartyMediator.prototype.addValidator = function addValidator(validator) {
  this.validator = validator;
};

PartyMediator.prototype.addView = function addView(view) {
  this.view = view;
};

PartyMediator.prototype.addParticipants = function add(participants) {
  for (let key in participants) {
    this.add = participants[key];
  }
};

PartyMediator.prototype.send = function (message, receiver) {
  receiver.excute(message, this, [].slice.call(arguments, 2));
};

PartyMediator.prototype.excute = function (message, from) {
  if (from === this.referee) {
    let nextIndex;
    switch (message) {
      case MESSAGE.REJECT: // if current player realise  winning combinaison, opposite is reject below
        console.log("accept message");
        console.log(this.currentPlayer);
        alert(this.currentPlayer.name, "wins, Bravo!");

        break;
      case MESSAGE.ACCEPT:
        nextIndex = this.players.indexOf(this.currentPlayer);
        if (nextIndex < this.players.length - 1) {
          this.currentPlayer = this.players[nextIndex + 1];
        } else {
          this.currentPlayer = this.players[0];
        }
        this.count++;
        if (this.count < PLAY_LIMIT) {
          this.send(MESSAGE.PLAY, this.currentPlayer);
        }

        break;
    }
  }

  else if (from === this.validator) {
    switch (message) {
      case MESSAGE.ACCEPT:
        var { row, column } = arguments[2][0];
        var Node = this.currentPlayer.symbol;
        store.dispatch(update({ row, column, Node }));
        this.send(MESSAGE.VALIDATE, this.referee, arguments[2][0]);
        break;
      case MESSAGE.REJECT:
        this.send(MESSAGE.PLAY, this.currentPlayer);
        break;
    }
  } else if (message === MESSAGE.PLAYED && this.players.includes(from)) {
    this.send(MESSAGE.VALIDATE, this.validator, arguments[2]);
  }
};

PartyMediator.prototype.init = function initiateParty() {
  this.currentPlayer = this.players[0];
  this.send(MESSAGE.PLAY, this.currentPlayer);
};

export { MESSAGE };
export default PartyMediator;

