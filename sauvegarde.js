*****************************************************************
*    PLAYERS 
*/

function Player() {
  var _symbol = "";
  Object.defineProperty(this, "symbol",
    {
      set: function setSymbol(symbol) { _symbol = symbol; },
      get: function getSymbol() { return _symbol; }
    });
}
Player.prototype = {
  play: function play() {
    return this.select().then(function onFulfilled(target) {
      return Promise.resolve(target.position);
    });
  }
};

function Computer() { }
Computer.prototype = new Player;
Computer.prototype.constructor = Computer;
Computer.prototype.select = function () {
  return new Promise(function resolver(resolve) {
    setTimeout(function personSelect() {
      resolve({ position: parseInt(Math.random() * view._length()) });
    }, 1000);
  });
};

function Person() { }
Person.prototype = new Player;
Person.prototype.constructor = Person;
Person.prototype.select = function () {
  return new Promise(function resolver(resolve) {
    function clickHandler(e) {
      e.target.position = view._indexOf(e.target);
      resolve(e.target);
    }
    gameBoard.addEventListener("click", clickHandler, { once: true });
  });
};

/****************************************
 * Match and Party
 ***************************************/
function Party(players, rules) {
  const _players = players;
  const _rules = rules;
  console.log(_rules);
  Object.defineProperty(this, "players", { get: function getPlayers() { return _players; } });
  Object.defineProperty(this, "rules", { get: function getRules() { return _rules; } });
}

Party.prototype.run = function runParty() {
  const ctx = this;
  return this.players.reduce(function (promise, player) {
    return promise.then(function onFulfilled() {
      return ctx.controller(player);
    });
  }, Promise.resolve());
};

Party.prototype.controller = function controlParty(currentPlayer) {
  var ctx = this;
  return currentPlayer.play().then(function onFulfilled(position) {
    return ctx.validator(position).then(function onFulfilled(node) {
      view.update(node, currentPlayer.symbol);
      return Promise.resolve(position); // need to wait till this resolved
    }, function onRejected() {
      return controlParty(currentPlayer); // need to wait till this resolved
    });
  });
};

Party.prototype.validator = function valide(position) {
  var gameBoardButtons = [];
  Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
    Array.from(line.children).forEach(function gameCell(cell) {
      gameBoardButtons.push(cell.children);
    });
  });
  /// validate on model on on dom;
  if (!gameBoardButtons[position][0].children[0]) {
    return Promise.resolve(gameBoardButtons[position][0]).then(function onFulfilled(position) {
      return TICTACTOE.winning(position);
    });
  }
  else {
    return Promise.reject(position);
  }
};

/** 
 * Match ; 
 */
function Match(players) {
  var _winner = null;
  const _players = players;
  Object.defineProperty(this, "winner", {
    get: function getWinner() { return _winner; },
    set: function setWinner(winner) { _winner = winner; }
  });
  Object.defineProperty(this, "players", { get: function getPlayers() { return _players; } });
}
Match.prototype.addSymbolToPlayer = function (player, symbol) {
  player.symbol = symbol;
};
Match.prototype.controller = function controller() {
  // copy from computer, now for dev, factorise later; 
  var gameBoardButtons = [];
  // a bit long all these children !!! -move this to a function and cached it !
  Array.from(gameBoard.children[0].children[0].children).forEach(function gameLine(line) {
    Array.from(line.children).forEach(function gameCell(cell) {
      gameBoardButtons.push(cell.children);
    });
  });

  // need robust iterator here 


};

Match.prototype.parties = function* parties() {
  let _number = 0;
  while (!this.winner) {
    yield new Party(this.players, { check: function () { console.log("check rules"); } });
    if (_number == 1) { this.winner = true; }
    console.log(_number, this.winner);
    _number++;

  }
  return this.winner;
};

// messing, need review & refactorisation !!!! 
// check the stack !!
Match.prototype.run = function run() {
  var _parties = this.parties();
  function runParties({ value, done }) {
    if (done) return Promise.resolve({ value, done }).then(() => console.log("Match finished"));
    return Promise.resolve({ value, done }).then(function onFulfilled(res) {
      return Promise.all([res.value.run(), _parties.next(res)]).then(([prev, next]) => runParties(next));
    }).catch(function onrejected(reason) {
      return runParties(_parties.throw(reason));
    });
  }

  try {
    return runParties(_parties.next());
  } catch (err) {
    return Promise.reject(err);
  }
};

Match.prototype.winning = function checkWinning(position) {
  /*return rules.reduces((promise, rule) => promise.then(function onFulfilled() {
    return rule();
  }), Promise.resolve());*/
  console.log(position);
  console.log("winning test");
  return Promise.resolve(position);
};

// some tests - coding continue 
var person = new Person();
var computer = new Computer();
person.symbol = React.createElement("p", { children: "Person" }); // replace with font item 
computer.symbol = React.createElement("p", { children: "Computer" });
var TICTACTOE = new Match([person, computer]);
TICTACTOE.lineTest = function (origin) {
  if (this.table[player.position.line].join('') == player.symbol.repeat(this.dim)) {
    player.attribute = this.state.win;
  }
};
TICTACTOE.run();

/*
Game.prototype.lineTest = function(player){
// check if the player has  aligned 3 symbol horizontally
if(this.table[player.position.line].join('')==player.symbol.repeat(this.dim)){
  player.attribute =this.state.win;
}
};

Game.prototype.columnTest = function(player){
// check if the player has  aligned 3 symbol vertically
var columnIndex = player.position.column;  
if(this.table[0][columnIndex]!="0" && this.table[0][columnIndex]==this.table[1][columnIndex] && this.table[0][columnIndex]==this.table[2]   [columnIndex]){
  player.attribute =this.state.win;
}
};

Game.prototype.positiveDiagonalTest = function(player){
// check if the player has  aligned 3 symbol diagonally (first)
if(player.position.line==player.position.column) {
 
     if (this.table[0][0]!="0" && this.table[0][0]==this.table[1][1] && this.table[1][1]==this.table[2][2]) {
         player.attribute =this.state.win;
     }
 }
};

Game.prototype.negativeDiagonalTest = function(player){
// check if the player has  aligned 3 symbol diagonally (second) 
 if(player.position.line==2-player.position.column) {
   
    if (this.table[0][2]!="0" && this.table[0][2]==this.table[1][1] && this.table[2][0]==this.table[1][1]){
       player.attribute =this.state.win;
  }
}
};

*/

    // all this need optimisation, caching,
  /*  function _indexOf(target) {
      var gameBoardButtons = Array.from(gameBoard.children[0].children[0].children);
      var ln = gameBoardButtons.length;
      for (let index in gameBoardButtons) {
        for (let td of gameBoardButtons[index].children) {
          if (td.children[0] == target) {
            return index * ln + Array.from(gameBoardButtons[index].children).indexOf(td);
          }
        }
      }
      return -1;
    }

    function _length() {
      return _dim * 2;
    }

    return {
      update: update,
      addClickEvent: addClickEvent,
      _indexOf: _indexOf,
      _length: _length
    };

  })();
*/
