const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { 
  Game
} = require("./game/GameLogic");
const {
  RealEstate,
  COST_OF_TROPHY,
  rollOneDie
} = require('./game/Shared');
const {
  StockSpace,
  ShareholderMeetingSpace,
  RealEstateSpace,
  BonusSpace,
  DollarSpace,
  TrophySpace,
  BrokerFeeSpace,
  BlackThursdaySpace,
  TaxmanComethSpace,
  FreeLunchSpace,
  VegasSpace,
  DoOrDieSpace,
  WildCardSpace
} = require('./game/Spaces');
const {
  createEvent,
  applyEvent,
  EventTypes
} = require("./events");
const { create } = require("domain");


const app = express();
const server = http.createServer(app);
const PORT = 5000;

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

let game = new Game();
console.log("GS : ", game.getGameState());

let gameLoadedFromImport = false;
let winAttempt = null;

app.get('', (req, res) => {
  res.send("Server is running!");
});

// Player connects
io.on('connection', (socket) => {
  console.log("Player connected: " + socket.id);

  console.log("Emitting gamestate to", socket.id);
  socket.emit('gameState', game.getGameState());
  console.log("Sent gamestate to", socket.id);

  // Player joins game
  //
  socket.on('joinGame', (playerName) => {
    if (game === null) {
      game = new Game();
    }

    const player = {
      id: game.players.length,
      socketId: socket.id,
      name: playerName,
      position: 0
    }

    logEvent(createEvent(EventTypes.PLAYER_JOIN, { player }));
    console.log("Player \"" + playerName + "\" joined");

    io.emit('gameState', game.getGameState());
  });

  socket.on('getGameState', () => {
    socket.emit('gameState', game.getGameState());
  })

  // Player rolls dice
  socket.on('rollDice', () => {
    if (game !== null) {
      const player = game.players.find(pl => pl.socketId === socket.id);
      console.log('player: ', player);
        if (player) {
          if (game.playerTurn == player.id) {
            // Random roll
            const dist = game.roll();

            // Test stock space
            // const dist = game.roll(1);

            // Test shareholder meeting space
            // const dist = game.roll(4);

            // Test real estate space
            // const dist = game.roll(10);

            // Test bonus space
            // const dist = game.roll(44);

            // Test dollar space
            // const dist = game.roll(2);

            // Test trophy space
            // const dist = game.roll(7);

            // Test broker fee space
            // const dist = game.roll(39);

            // Test black thursday space
            // const dist = game.roll(6);

            // Test taxman cometh space
            // const dist = game.roll(17);

            // Test free lunch space
            // const dist = game.roll(35);

            // Test vegas space
            // const dist = game.roll(28);

            // Test do or die space
            // const dist = game.roll(13);

            // Test wild card space
            // const dist = game.roll(21);

            logEvent(createEvent(EventTypes.ROLL_DICE, {
              playerId: player.id,
              distance: dist
            }));

            const space = game.board[player.position];

            if (space instanceof StockSpace) {
              socket.emit('promptStockSpaceEffect', {
                companyName: space.companyName,
                stockPrice: game.stockTracker.getPrice(space.companyName)
              });
            }

            if (space instanceof ShareholderMeetingSpace) {
              socket.emit('promptShareholderMeetingSpaceEffect', {
                companyName: space.companyName,
                stockPrice: game.stockTracker.getPrice(space.companyName)
              });
            }

            if (space instanceof RealEstateSpace) {
              socket.emit('promptRealEstateSpaceEffect', {
                property: space.realEstate,
                floors: 0,
                playerId: player.playerId
              });
            }

            if (space instanceof BonusSpace) {
              socket.emit('promptBonusSpaceEffect');
            }

            if (space instanceof DollarSpace) {
              socket.emit('promptDollarSpaceEffect');
            }

            if (space instanceof TrophySpace) {
              socket.emit('promptTrophySpaceEffect');
            }

            if (space instanceof BrokerFeeSpace) {
              console.log("Prompting broker fee");
              let shareCount = player.shareCount();
              socket.emit('promptFeeSpaceEffect', { shareCount });
            }

            if (space instanceof BlackThursdaySpace) {
              console.log("Prompting black thursday");
              let shareCount = player.shareCount();
              socket.emit('promptFeeSpaceEffect', { shareCount });
            }

            if (space instanceof TaxmanComethSpace) {
              console.log("Prompting taxman cometh");
              cashOutValue = player.cashOutValue(game.stockTracker)
              socket.emit('promptTaxmanComethSpaceEffect', { cashOutValue });
            }

            if (space instanceof DoOrDieSpace) {
              console.log("Prompting do or die");
              socket.emit('promptVegasSpaceEffect');
            }

            if (space instanceof FreeLunchSpace) {
              console.log("Prompting free lunch");
              socket.emit('promptFreeLunchSpaceEffect');
            }

            if (space instanceof VegasSpace) {
              console.log("Prompting vegas");
              socket.emit('promptVegasSpaceEffect');
            }

            if (space instanceof WildCardSpace) {
              socket.emit('promptWildCardSpaceEffect', {
                companyName: space.companyName,
                stockPrice: game.stockTracker.getPrice(space.companyName)
              });
            }
          }
        io.emit('gameState', game.getGameState());

        console.log(game.getGameState());
      }
    }
  });

  // Player wants to sell stock
  socket.on('sellStock', () => {
    if (game !== null) {
      const player = game.players.find(pl => pl.socketId === socket.id);
      if (player) {
        if (game.playerTurn == player.id) {
          socket.emit('promptSellStock');
        }
      }
    }
    
    io.emit('gameState', game.getGameState());

    console.log(game.getGameState());
  });

  // Player clicks the win game button
  socket.on('winGame', () => {
    if (game !== null) {
      const player = game.players.find(pl => pl.socketId === socket.id);
      if (player) {
        if (game.playerTurn == player.id) {
          socket.emit('promptWinGame');
        }
      }
    }
  });

  // Player disconnect
  socket.on('disconnect', () => {
    console.log("DISCONNECTED: Player " + socket.id);
    if (game !== null) {
      game.players = game.players.filter(player => player.id !== socket.id);
      io.emit('gameState', game.getGameState());
    }
  });
  

  // -------- Saving games ---------
  socket.on('exportGame', () => {
    console.log("Exporting game log...");
    if (game !== null) {
      let log = game.gameLog
      console.log("\n\nGame log: \n", log);
      io.emit('exportGameLog', JSON.stringify(log));
    }
  });

  socket.on('importGame', ({ gameLog }) => {
    if (!gameLoadedFromImport) {
      game = rebuildGameFromEventLog(gameLog);
      game.gameLog = gameLog;

      game.players.forEach(p => {
        p.socketId = null;
      });

      gameLoadedFromImport = true;

      console.log('Game has been imported');
    }

    const playerList = game.players.map(p => ({
      id: p.id,
      name: p.name,
    }));
  
    socket.emit('choosePlayer', { players: playerList });
  
    socket.once('playerSelected', ({ playerId }) => {
      const selectedPlayer = game.players.find(
        p => p.id === playerId
      );
      
      if (!selectedPlayer) {
        return;
      }

      selectedPlayer.socketId = socket.id;
      console.log('Player reconnected: ', selectedPlayer);

      io.emit('gameState', game.getGameState());
    });
  });
  

  // -------- Space effects ---------
  socket.on('sellStockEffect', ({ companyName, quantity }) => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }
      
      logEvent(createEvent(EventTypes.SELL_STOCK, {
        playerId: player.id,
        companyName,
        quantity
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('payFeeEffect', () => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.PAY_FEE, {
        playerId: player.id
      }));

      io.emit('gameState', game.getGameState());
    }
  })

  socket.on('payTaxmanComethEffect', () => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.PAY_TAXMAN, {
        playerId: player.id
      }));

      io.emit('gameState', game.getGameState());
    }
  })

  socket.on('stockSpaceEffect', ({ companyName, quantity }) => {
    if (game !== null) {
      // const playerId = game.players.find(p => p.socketId === socket.id).id;
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.BUY_STOCK, {
        playerId: player.id,
        companyName,
        quantity
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('winGameEffect', () => {
    console.log('Someone is trying to win');
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      console.log('Player: ', player.name);

      if (player.cashOutValue(game.stockTracker) >= 100000) {
        console.log('Bitter pill is prompted');

        if (game.players.length === 1) {
          logEvent(createEvent(EventTypes.WIN_GAME, {
            playerId: player.id
          }));
          io.emit('gameOver', game.winner.name);
          return;
        }

        winAttempt = { winnerId: player.id, responses: {}, count: 0 };

        game.players.filter(p => p.id !== player.id).forEach(p => {
          io.to(p.socketId).emit('promptBitterPill', {
            winnerName: player.name
          });
        });

        console.log('Waiting for bitter pill...');
        io.to(player.socketId).emit('waitingForBitterPill');  
      }

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('bitterPillResponse', (response) => {
    const player = game.players.find(p => p.socketId === socket.id);
    if (!player) {
      return;
    }

    if (player.tookPill) {
      winAttempt.responses[player.id] = false;
    } else {
      winAttempt.responses[player.id] = response;
    }
    
    console.log("Pill responses:", winAttempt.responses);

    winAttempt.count += 1;

    const pillTaken = Object.values(winAttempt.responses).includes(true);
    const allPlayersResponded = winAttempt.count === game.players.length - 1;

    console.log('pill taken, all responded', pillTaken, allPlayersResponded);
    console.log('responses:', winAttempt.responses);

    if (pillTaken) {
      const pillTakerId = Object.keys(winAttempt.responses).find(
        id => winAttempt.responses[id] === true
      );

      logEvent(createEvent(EventTypes.TOOK_PILL, {
        pillTakerId: pillTakerId,
        winnerId: winAttempt.winnerId
      }));

      console.log('pilltakerid: ', pillTakerId);
      console.log('pilltaker: ', game.players[pillTakerId]);

      const pillTakerName = game.players[pillTakerId].name;
      console.log('pillTakerName: ', pillTakerName);

      io.emit('bitterPillTaken', ({ pillTakerName }));
      io.emit('gameState', game.getGameState());

    } else if (allPlayersResponded === true) {
      logEvent(createEvent(EventTypes.WIN_GAME, {
        playerId: winAttempt.winnerId
      }));

      const winnerName = game.winner.name;

      io.emit('gameOver', winnerName);
    }
  });

  socket.on('shareholderMeetingSpaceEffect', ({ companyName }) => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      const dieRoll = rollOneDie();

      logEvent(createEvent(EventTypes.SHAREHOLDER_MEETING, {
        playerId: player.id,
        companyName,
        dieRoll
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('purchaseRealEstate', ({ property }) => {
    console.log("Buying real estate", property);
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }
      
      logEvent(createEvent(EventTypes.BUY_REAL_ESTATE, {
        playerId: player.id,
        property
      }));
      
      io.emit('gameState', game.getGameState());
      console.log("Property owner:", property.owner);
    }
  });

  socket.on('realEstateSpaceEffect', ({ property }) => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      console.log('PROPERTY: ', property);

      let rent = 0;
      let mult = property.floors;
      if (mult >= 4) {
          mult = 3;
      }
      rent = property.initialRent * (mult + 1);

      logEvent(createEvent(EventTypes.PAY_RENT, {
        playerId: player.id,
        ownerId: property.owner,
        amount: rent
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('dollarSpaceEffect', () => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.DOLLAR, {
        playerId: player.id,
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('freeLunchSpaceEffect', () => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.FREE_LUNCH, {
        playerId: player.id,
        value: game.freeLunch,
      }));

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('bonusSpaceEffect', ({ decision }) => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);

      if (!player) {
        return;
      }

      logEvent(createEvent(EventTypes.BONUS, {
        playerId: player.id,
        amount: 2000,
        direction: decision
      }));

      io.emit('gameState', game.getGameState());
      console.log('Player direction: ', player.direction);
    }
  });

  socket.on('trophySpaceEffect', ({ decision }) => {
    if (game !== null) {
      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        return;
      }

      console.log('decision: ', decision)

      if (decision === true) {
        console.log('decision2: ', decision)
        logEvent(createEvent(EventTypes.PURCHASE_TROPHY, {
          playerId: player.id,
          decision: decision
        }));
      }

      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('vegasSpaceEffect', ({ targetId, amount }) => {
    if (game !== null) {
      console.log("TARGET ID: ", targetId);
      console.log("WAGER: ", amount);

      const player = game.players.find(p => p.socketId === socket.id);
      const target = game.players[targetId];

      if (!player) {
        console.log("Player DNE");
        return;
      }

      if (amount > player.cash || amount > target.cash) {
        console.log("Wager too big");
        return;
      }

      logEvent(createEvent(EventTypes.VEGAS, {
        playerId: player.id,
        targetId,
        amount
      }))
      
      io.emit('gameState', game.getGameState());
    }
  });

  socket.on('wildCardSpaceEffect', ({ companyName, quantity }) => {
    if (game !== null) {
      const playerId = game.players.find(p => p.socketId === socket.id).id;
      if (playerId === null) {
        return;
      }

      logEvent(createEvent(EventTypes.BUY_STOCK, {
        playerId: playerId,
        companyName,
        quantity
      }));

      io.emit('gameState', game.getGameState());
    }
  });
  
});


server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

function logEvent(event) {
  game.gameLog.push(event);
  const msg = applyEvent(game, event);

  io.emit('logMessage', msg);
}

function rebuildGameFromEventLog(gameLog) {
  const game = new Game();

  gameLog.forEach((e) => {
    applyEvent(game, e);
  });

  return game;
}