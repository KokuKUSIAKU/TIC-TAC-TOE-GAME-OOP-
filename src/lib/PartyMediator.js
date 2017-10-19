import update from "../state/update";
import store from "../state/state"; 

/****************************************
 * Match and PartyMediator
 ***************************************/
const PLAY_LIMIT = 9; // just for 3x3 board now 

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
  var _currentPlayer = null;
  this.count = 1;
  var _participants = {
    players: [],
    first: null,
    validator: null,
    referee: null,
    view: null
  };
  Object.defineProperty(this, "players", { get: function getPlayers() { return _participants.players; } });
  Object.defineProperty(this, "currentPlayer",
    {
      get: function getCurrentPlayers() { return _currentPlayer; },
      set: function setCurrentPlayers(player) { _currentPlayer = player; }
    });
  Object.defineProperty(this, "firstPlayer",
    {
      set: function setFirstPlayer(player) { _participants.first = player; },
      get: function setFirstPlayer() { return _participants.first; }
    });
  Object.defineProperty(this, "validator",
    {
      get: function getValidator() { return _participants.validator; }
    });
  Object.defineProperty(this, "view",
    {
      get: function getView() { return _participants.view; }
    });
  Object.defineProperty(this, "referee",
    {
      get: function getReferee() { return _participants.referee; }
    });
  Object.defineProperty(this, "add",
    {
      set: function addParticipants({ type, participant }) {
        switch (type) {
          case "PLAYER":
            _participants.players.push(participant);
            _participants.last = participant;
            break;
          case "VALIDATOR":
            if (!_participants.validator) {
              _participants.validator = participant;
            } else {
              // set up alert here 
            }
            break;
          case "REFEREE":
            if (!_participants.referee) {
              _participants.referee = participant;
            } else {
              // set up alert here 
            }
            break;
          case "VIEW":
            if (!_participants.view) {
              _participants.view = participant;
            } else {
              // set up alert here 
            }
            break;
          default:
            throw new RangeError("First argument must specify a type between PLAYER, VALIDATOR , VIEW, REFEREE");

        }
      }
    });
}

PartyMediator.prototype.send = function (message, receiver) {
  receiver.excute(message, [].slice.call(arguments, 2));
};

PartyMediator.prototype.receive = function (message, from) {

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
          this.currentPlayer = this.firstPlayer;
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
        //this.view.update(arguments[2][0].target, this.currentPlayer.symbol);
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
  this.firstPlayer = this.players[0];
  this.currentPlayer = this.firstPlayer;
  this.send(MESSAGE.PLAY, this.currentPlayer);
};

export { MESSAGE };
export default PartyMediator;

