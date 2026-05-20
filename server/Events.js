const { 
    Game
  } = require("./game/GameLogic");
  const {
    RealEstate,
    rollOneDie,
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

const COST_OF_TROPHY = 2000;
class GameEvent {
    constructor(type, payload) {
      this.type = type;
      this.payload = payload;
      this.meta = {
        timestamp: Date.now(),
      };
    }
  }
  
  const EventTypes = {
    PLAYER_JOIN: "PLAYER_JOIN",
    ROLL_DICE: "ROLL_DICE",
    SELL_STOCK: "SELL_STOCK",
    BUY_STOCK: "BUY_STOCK",
    WIN_GAME: "WIN_GAME",
    TOOK_PILL: "TOOK_PILL",
    SHAREHOLDER_MEETING: "SHAREHOLDER_MEETING",
    DOLLAR: "DOLLAR",
    BUY_REAL_ESTATE: "BUY_REAL_ESTATE",
    PAY_RENT: "PAY_RENT",
    BONUS: "BONUS",
    PURCHASE_TROPHY: "PURCHASE_TROPHY",
    PAY_FEE: "PAY_FEE",
    VEGAS: "VEGAS",
    PAY_TAXMAN: "PAY_TAXMAN",
    FREE_LUNCH: "FREE_LUNCH",
  };
  
  const EventFields = {
    [EventTypes.PLAYER_JOIN]: ["player"],
    [EventTypes.ROLL_DICE]: ["playerId", "distance"],
    [EventTypes.SELL_STOCK]: ["playerId", "companyName", "quantity"],
    [EventTypes.BUY_STOCK]: ["playerId", "companyName", "quantity"],
    [EventTypes.WIN_GAME]: ["playerId"],
    [EventTypes.TOOK_PILL]: ["pillTakerId", "winnerId"],
    [EventTypes.SHAREHOLDER_MEETING]: ["playerId", "companyName", "dieRoll"],
    [EventTypes.DOLLAR]: ["playerId"],
    [EventTypes.BUY_REAL_ESTATE]: ["playerId", "property"],
    [EventTypes.PAY_RENT]: ["playerId", "ownerId", "amount"],
    [EventTypes.BONUS]: ["playerId", "amount", "direction"],
    [EventTypes.PURCHASE_TROPHY]: ["playerId", "decision"],
    [EventTypes.PAY_FEE]: ["playerId"],
    [EventTypes.VEGAS]: ["playerId", "targetId", "amount"],
    [EventTypes.PAY_TAXMAN]: ["playerId"],
    [EventTypes.FREE_LUNCH]: ["playerId", "value"],
  };
  
  function createEvent(type, payload) {
    const event = new GameEvent(type, payload);
    validateEvent(event);
    return event;
  }
  
  function validateEvent(event) {
    const requiredFields = EventFields[event.type];
    if (!requiredFields) {
      throw new Error(`Unknown event type: ${event.type}`);
    }
  
    for (const field of requiredFields) {
      if (!(field in event.payload)) {
        throw new Error(`Missing field '${field}' in event ${event.type}`);
      }
    }
  }
  
  function applyEvent(game, event) {
    switch (event.type) {
      case EventTypes.PLAYER_JOIN: {
        game.addPlayer(event.payload.player);
        break;
      }
  
      case EventTypes.ROLL_DICE: {
        const { playerId, distance } = event.payload;
        // game.roll(playerId, distance);
        game.movePlayer(game.players[playerId], distance);
        break;
      }

      case EventTypes.SELL_STOCK: {
        const { playerId, companyName, quantity } = event.payload;
        const player = game.players[playerId];
  
        const price = game.stockTracker.getPrice(companyName);
        const cost = price * quantity;
  
        if (player.stocks[companyName] >= quantity) {
          player.cash += cost;
          player.stocks[companyName] -= quantity;
        }
        break;
      }

      case EventTypes.PAY_FEE: {
        const { playerId } = event.payload;
        const player = game.players[playerId];

        const cost = 10 * player.shareCount();

        player.cash -= cost;
        game.freeLunch += cost;
        break;
      }

      case EventTypes.PAY_TAXMAN: {
        const { playerId } = event.payload;
        const player = game.players[playerId];

        const cost = 2*player.cashOutValue(game.stockTracker)/10;

        player.cash -= cost;
        game.freeLunch += cost;
        break;
      }
  
      case EventTypes.BUY_STOCK: {
        const { playerId, companyName, quantity } = event.payload;
        const player = game.players[playerId];
  
        const price = game.stockTracker.getPrice(companyName);
        const cost = price * quantity;
  
        if (player.cash >= cost) {
          player.cash -= cost;
          player.stocks[companyName] += quantity;
        }
        break;
      }

      case EventTypes.PURCHASE_TROPHY: {
        const { playerId, decision } = event.payload;
        const player = game.players[playerId];
        console.log('player: ', player.name);

        console.log('decision3: ', decision);
        if (decision === false) {
          break;
        }

        console.log('cost1: ', COST_OF_TROPHY);

        if (player.cash >= COST_OF_TROPHY) {
          console.log('cost2: ', COST_OF_TROPHY);
          player.cash -= COST_OF_TROPHY;
          player.trophies += 1;
        }
        break;
      }

      case EventTypes.WIN_GAME: {
        const { playerId } = event.payload;
        const player = game.players[playerId];
  
        game.winner = player;
        break;
      }

      case EventTypes.TOOK_PILL: {
        const { pillTakerId, winnerId } = event.payload;

        const pillTaker = game.players[pillTakerId];
        const winner = game.players[winnerId];

        console.log("pilltaker", pillTaker.name);
        console.log("pilltaker cash", pillTaker.cashOutValue(game.stockTracker));
        console.log("winner", winner.name);
        console.log("winner", winner.cashOutValue(game.stockTracker));
  
        winner.cash -= pillTaker.cashOutValue(game.stockTracker);

        if (winner.cash < 0) {
          winner.cash = 1000;
        }

        pillTaker.takePill();
  
        break;
      }
  
      case EventTypes.SHAREHOLDER_MEETING: {
        const { playerId, companyName, dieRoll } = event.payload;
        const player = game.players[playerId];
        const price = game.stockTracker.getPrice(companyName);
  
        if (player.cash >= price) {
          player.cash -= price;
          player.stocks[companyName] += 1;
          player.stocks[companyName] *= dieRoll;
        }
        break;
      }

      case EventTypes.DOLLAR: {
        const { playerId } = event.payload;
        const player = game.players[playerId];
        const vals = [350, 550, 750];

        player.cash += vals[Math.floor((Math.random() * vals.length))];

        break;
      }

      case EventTypes.FREE_LUNCH: {
        const { playerId, value } = event.payload;
        const player = game.players[playerId];

        player.cash += value;
        game.freeLunch = 0;

        break;
      }
  
      case EventTypes.BUY_REAL_ESTATE: {
        const { playerId, property } = event.payload;
        const player = game.players[playerId];

        if ((property.owner !== playerId) && (player.cash >= property.cost)) {
          player.cash -= property.cost;
          property.owner = playerId;
          player.realEstate.push(property);
        }

        const space = game.board.find(s => 
          s instanceof RealEstateSpace &&
          s.realEstate.name == property.name
        );
      
        if (space) {
          space.realEstate.owner = playerId;
        }
        
        console.log('Property owner is: ', property.owner);
        console.log('Property owner is: ', space.realEstate.owner);

        break;
      }
  
      case EventTypes.PAY_RENT: {
        const { playerId, ownerId, amount } = event.payload;
  
        game.players[playerId].cash -= amount;
        game.players[ownerId].cash += amount;
        break;
      }
  
      case EventTypes.BONUS: {
        const { playerId, amount, direction } = event.payload;
  
        game.players[playerId].cash += amount;
        game.players[playerId].direction = direction;
        break;
      }
  
      case EventTypes.TROPHY: {
        const { playerId } = event.payload;
  
        game.players[playerId].trophies += 1;
        break;
      }

      case EventTypes.VEGAS: {
        const { playerId, targetId, amount } = event.payload;
        const player = game.players[playerId];
        const target = game.players[targetId];

        console.log("Playerid:", playerId);
        console.log("Targetid:", targetId);

        let playerRoll = rollOneDie();
        let targetRoll = rollOneDie();

        player.cash -= amount;
        target.cash -= amount;

        if (playerRoll > targetRoll) {
          player.cash += amount;
        } 
        else if (playerRoll < targetRoll) {
          target.cash += amount;
        }
        
        break;
      }
    }
    message = logEvent(event);
    return message;
  }

  function logEvent(event) {
    const { type, payload, meta } = event;
  
    switch (type) {
      case EventTypes.PLAYER_JOIN:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.player.name} joined the game.`;
  
      case EventTypes.ROLL_DICE:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} rolled ${payload.distance}.`;
  
      case EventTypes.BUY_STOCK:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} bought ${payload.quantity} shares of ${payload.companyName}.`;
  
      case EventTypes.SELL_STOCK:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} sold ${payload.quantity} shares of ${payload.companyName}.`;
  
      case EventTypes.WIN_GAME:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} won the game!`;
  
      case EventTypes.TOOK_PILL:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.pillTakerId} took a pill for ${payload.winnerId}.`;
  
      case EventTypes.SHAREHOLDER_MEETING:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} attended a shareholder meeting for ${payload.companyName} (rolled ${payload.dieRoll}).`;
  
      case EventTypes.DOLLAR:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} received a dollar bonus.`;
  
      case EventTypes.FREE_LUNCH:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} received a free lunch.`;
        
      case EventTypes.BUY_REAL_ESTATE:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} bought ${payload.property.name}.`;
  
      case EventTypes.PAY_RENT:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} paid $${payload.amount} rent to Player ${payload.ownerId}.`;
  
      case EventTypes.BONUS:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} received a bonus of $${payload.amount} and moved ${payload.direction}.`;
  
      case EventTypes.PURCHASE_TROPHY:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} purchased a trophy.`;
  
      case EventTypes.PAY_FEE:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} paid a fee.`;
        
      case EventTypes.PAY_TAXMAN:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} paid the taxman.`;
  
      case EventTypes.VEGAS:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Player ${payload.playerId} wagered $${payload.amount} with ${payload.targetId}`;
  
      default:
        return `[${new Date(meta.timestamp).toLocaleTimeString()}] Unknown event: ${type}`;
    }
  }
  
  module.exports = {
    createEvent,
    applyEvent,
    EventTypes,
  };