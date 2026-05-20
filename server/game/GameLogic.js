
// The board is 12 spaces long on each edge, so 12+12+10+10 = 44
// const BOARD_LENGTH = 44;
// const CLOCKWISE = 1;
// const COUNTERCLOCKWISE = -1;

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
} = require('./Spaces');

const {
    BOARD_LENGTH,
    CLOCKWISE,
    COUNTERCLOCKWISE,
    BONUS_AMOUNT = 1000,
    rollOneDie,
    RealEstate
} = require('./Shared');

const STARTING_CASH = 500000;
const WINNING_CASH = 100000;
const STARTING_STOCK_SUPPLY = 5000;
const COMPANIES = ["AUH2O", "Dough, Ray & Me", "fiasCo.", "Acme", "Cataldo Supply", "JETCETERA"];
const COMPANY_ABBR = {"AUH2O": "AUH", "Dough, Ray & Me": "DRM", "fiasCo.": "FSC", "Acme": "ACM", "Cataldo Supply": "CAT", "JETCETERA": "JET"};
const STOCK_TRACKER_MIN = {"AUH2O": 182, "Dough, Ray & Me": 124, "fiasCo.": 10, "Acme": 58, "Cataldo Supply": 18, "JETCETERA": 30};
const STOCK_TRACKER_MAX = {"AUH2O": 30, "Dough, Ray & Me": 10, "fiasCo.": 124, "Acme": 20, "Cataldo Supply": 94, "JETCETERA": 182};
const STOCK_TRACKER_INCREMENTS = {"AUH2O": -4, "Dough, Ray & Me": -3, "fiasCo.": 3, "Acme": -1, "Cataldo Supply": 2, "JETCETERA": 4};

const TEST_START_POSITION = 0;
const TEMP_VALUE = 1000;


class Player {
    constructor(id, socketId, name, startPosition) {
        this.id = id;
        this.socketId = socketId;
        this.name = name;
        this.position = startPosition;
        this.cash = STARTING_CASH;
        this.stocks = {"AUH2O": 0, "Dough, Ray & Me": 0, "fiasCo.": 0, "Acme": 0, "Cataldo Supply": 0, "JETCETERA": 0};
        this.realEstate = [];
        this.trophies = 0;
        this.direction = CLOCKWISE;
        this.chooseDirection = false;
        this.winner = null;
        this.tookPill = false;
    }

    move(distance, direction) {
        this.position = (this.position + (direction * distance) + BOARD_LENGTH) % BOARD_LENGTH;
    }

    stockValue(stockTracker) {
        let value = 0;
        for (let company in this.stocks) {
            value = value + (this.stocks[company] * stockTracker.getPrice(company));
        }

        return value
    }

    trophyValue() {
        return this.trophies * 5000 * this.trophies;
    }

    cashOutValue(stockTracker) {
        return this.cash + this.stockValue(stockTracker) + this.trophyValue();
    }

    shareCount() {
        let total = 0;

        for (let i in this.stocks) {
            total = total + this.stocks[i];
        }

        return total;
    }

    takePill() {
        this.cash = 1000;
        this.stocks = {"AUH2O": 0, "Dough, Ray & Me": 0, "fiasCo.": 0, "Acme": 0, "Cataldo Supply": 0, "JETCETERA": 0};
        this.realEstate = [];
        this.trophies = 0;
        this.tookPill = true;
    }
}

class Game {
    constructor() {
        this.players = [];
        this.playerTurn = 0;
        this.board = createBoard();
        this.stockTracker = new StockTracker();
        this.freeLunch = 0;
        this.gameLog = [];
        this.companies = COMPANIES;
        this.companyAbbr = COMPANY_ABBR;
    }

    addPlayer(player) {
        this.players.push(new Player(
            player.id,
            player.socketId,
            player.name,
            player.position
        ));
    }

    roll(seededValue = 0, seededDoubles = null) {
        const player = this.players[this.playerTurn];
        let distance = 0;
        let rolledDoubles = false;

        if (seededValue === 0) {
            const die1 = rollOneDie()
            const die2 = rollOneDie();
            distance = die1 + die2;
            rolledDoubles = (die1 == die2);
        } 
        
        if (seededDoubles !== null) {
            rolledDoubles = seededDoubles;
        }
        
        if (seededValue !== 0) {
            distance = seededValue;
        }

        if (rolledDoubles !== true) {
            this.playerTurn = nextTurn(this.playerTurn, this.players.length);
        }

        return distance;
    }

    movePlayer(player, distance) {
        var direction = player.direction;

        const oldPosition = player.position;
        player.move(distance, direction);
        const newPosition = player.position;

        this.checkBonusPassed(player, oldPosition, newPosition);

        const space = this.board[newPosition];
        
        space.landEffect(this, player);
    }

    checkBonusPassed(player, oldPosition, newPosition) {
        if (player.direction == CLOCKWISE) {
            if (newPosition < oldPosition) {
                this.board[0].passEffect(this, player);
            }
        } else {
            if (newPosition > oldPosition) {
                this.board[0].passEffect(this, player);
            }
        }
    }

    playerWithTallestBuilding() {
        let tallestPlayer = null;
        let count = 0;

        // Check all players for if they own property
        for (let i = 0; i < this.players.length; i = i + 1) {
            const player = this.players[i];

            // Check each of those player's property
            for (let j = 0; j < player.realEstate.length; j = j + 1) {
                const property = player.realEstate[j];

                if (property.floors > count) {
                    count = property.floors;
                    tallestPlayer = player;
                }
            }
        }

        return tallestPlayer;
    }

    getGameState() {
        return {
            stockTracker: this.stockTracker,
            board: this.board,
            players: this.players,
            playerTurn: this.playerTurn,
            freeLunch: this.freeLunch,
            gameLog: this.gameLog,
            companies: this.companies,
            companyAbbr: this.companyAbbr,
            winner: this.winner,
        }
    }
}

class StockTracker {
    constructor() {
        this.stockPrices = this.createStockPrices();
        this.index = 10;
        this.companies = COMPANIES;
    }

    createStockPrices() {
        let maps = [];
        let currentMap = {};

        for (let i in STOCK_TRACKER_MIN) {
            currentMap[i] = STOCK_TRACKER_MIN[i];
        }
        
        let continueLoop = true;
        
        while (continueLoop) {
            let newMap = {};

            for (let i in currentMap) {
                newMap[i] = currentMap[i];
            }
            maps.push(newMap);

            for (let i in currentMap) {
                let nextPrice = currentMap[i] + STOCK_TRACKER_INCREMENTS[i];
                currentMap[i] = nextPrice;
            }

            for (let i in currentMap) {
                if (currentMap[i] < STOCK_TRACKER_MAX[i]) {
                    continueLoop = false;
                }
                break;
            }
        }

        maps.push(STOCK_TRACKER_MAX);

        return maps;
    }

    getPrice(companyName) {
        return this.stockPrices[this.index][companyName];
    }

    moveUp() {
        if (this.index < this.stockPrices.length - 1) {
            this.index = this.index + 1;
        }
    }

    moveDown() {
        if (this.index > 0) {
            this.index = this.index - 1;
        }
    }

    changeStockPrice(stockChange) {
        if (stockChange > 0) {
            for (let i = 0; i < stockChange; i = i + 1) {
                this.moveUp();
            }
        } else {
            for (let i = 0; i > stockChange; i = i - 1) {
                this.moveDown();
            }
        }
    }

    getIndex() {
        return this.index;
    }
}

function createBoard() {
    const board = [];

    const boardSpaces = [
        { type: 'BonusSpace', bonusAmount: BONUS_AMOUNT },
        { type: 'StockSpace', companyName: "JETCETERA", dividend: 11, stockChange: -1,  direction: CLOCKWISE },
        { type: 'DollarSpace', stockChange: -4, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "AUH2O", dividend: 4, stockChange: 2,  direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "Dough, Ray & Me", dividend: 0, stockChange: -1,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Cataldo Supply", dividend: 5, stockChange: 2,  direction: CLOCKWISE },
        { type: 'BlackThursdaySpace', stockChange: -15, direction: CLOCKWISE },
        { type: 'TrophySpace', stockChange: 3, direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "AUH2O", dividend: 0, stockChange: 1,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Acme", dividend: 9, stockChange: 3,  direction: CLOCKWISE },
        { type: 'RealEstateSpace', realEstate: new RealEstate("CVC", 1100, TEMP_VALUE), stockChange: 4, direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "fiasCo.", dividend: 0, stockChange: 2,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Dough, Ray & Me", dividend: 12, stockChange: 3,  direction: COUNTERCLOCKWISE },
        { type: 'VegasSpace', stockChange: -4, direction: COUNTERCLOCKWISE },
        { type: 'DollarSpace', stockChange: -4, direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "JETCETERA", dividend: 0, stockChange: 1,  direction: COUNTERCLOCKWISE },
        { type: 'StockSpace', companyName: "Cataldo Supply", dividend: 5, stockChange: -4,  direction: CLOCKWISE },
        { type: 'TaxmanComethSpace', stockChange: 15, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "fiasCo.", dividend: 10, stockChange: 2,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Dough, Ray & Me", dividend: 3, stockChange: -1,  direction: CLOCKWISE },
        { type: 'TrophySpace', stockChange: -3, direction: COUNTERCLOCKWISE },
        { type: 'WildCardSpace', stockChange: -2, direction: CLOCKWISE },
        { type: 'RealEstateSpace', realEstate: new RealEstate("U&U Cons.", 1000, TEMP_VALUE), stockChange: 2, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "AUH2O", dividend: 13, stockChange: -4,  direction: CLOCKWISE },
        { type: 'DollarSpace', stockChange: -1, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "JETCETERA", dividend: 4, stockChange: 2,  direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "Cataldo Supply", dividend: 0, stockChange: -3,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Dough, Ray & Me", dividend: 6, stockChange: -2,  direction: COUNTERCLOCKWISE },
        { type: 'VegasSpace', stockChange: -15, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Acme", dividend: 4, stockChange: 1,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "fiasCo.", dividend: 7, stockChange: -1,  direction: COUNTERCLOCKWISE },
        { type: 'TrophySpace', stockChange: -4, direction: CLOCKWISE },
        { type: 'RealEstateSpace', realEstate: new RealEstate("JP Ptnrs", 900, TEMP_VALUE), stockChange: -1, direction: CLOCKWISE },
        { type: 'DollarSpace', stockChange: -1, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "Cataldo Supply", dividend: 9, stockChange: 2,  direction: CLOCKWISE },
        { type: 'FreeLunchSpace', stockChange: -1, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "AUH2O", dividend: 4, stockChange: 2,  direction: CLOCKWISE },
        { type: 'ShareholderMeetingSpace', companyName: "Acme", dividend: 0, stockChange: -1,  direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "JETCETERA", dividend: 14, stockChange: 3,  direction: COUNTERCLOCKWISE },
        { type: 'BrokerFeeSpace', stockChange: 15, direction: CLOCKWISE },
        { type: 'StockSpace', companyName: "fiasCo.", dividend: 6, stockChange: 1,  direction: COUNTERCLOCKWISE },
        { type: 'StockSpace', companyName: "Acme", dividend: 4, stockChange: 2,  direction: CLOCKWISE },
        { type: 'TrophySpace', stockChange: -2, direction: CLOCKWISE },
        { type: 'RealEstateSpace', realEstate: new RealEstate("Emp. Bros.", 1250, TEMP_VALUE), stockChange: -2, direction: COUNTERCLOCKWISE },    
    ];

    for (let i = 0; i < BOARD_LENGTH; i = i + 1) {
        const curr = boardSpaces[i];
        let space;

        switch (curr.type) {
            case 'StockSpace':
                space = new StockSpace(i, curr.companyName, curr.dividend, curr.stockChange, curr.direction);
                break;
            case 'ShareholderMeetingSpace':
                space = new ShareholderMeetingSpace(i, curr.companyName, curr.dividend, curr.stockChange, curr.direction);
                break;
            case 'RealEstateSpace':
                space = new RealEstateSpace(i, curr.realEstate, curr.stockChange, curr.direction);
                break;
            case 'BonusSpace':
                space = new BonusSpace(i, curr.bonusAmount);
                break;
            case 'DollarSpace':
                space = new DollarSpace(i, curr.stockChange, curr.direction);
                break;
            case 'TrophySpace':
                space = new TrophySpace(i, curr.stockChange, curr.direction);
                break;
            case 'BrokerFeeSpace':
                space = new BrokerFeeSpace(i, curr.bonusAmount, curr.direction);
                break;
            case 'BlackThursdaySpace':
                space = new BlackThursdaySpace(i, curr.stockChange, curr.direction);
                break;
            case 'TaxmanComethSpace':
                space = new TaxmanComethSpace(i, curr.stockChange, curr.direction);
                break;
            case 'FreeLunchSpace':
                space = new FreeLunchSpace(i, curr.stockChange, curr.direction);
                break;
            case 'VegasSpace':
                space = new VegasSpace(i, curr.stockChange, curr.direction);
                break;
            case 'DoOrDieSpace':
                space = new DoOrDieSpace(i, curr.stockChange, curr.direction);
                break;
            case 'WildCardSpace':
                space = new WildCardSpace(i, curr.stockChange, curr.direction);
                break;
        }

        board.push(space);
    }

    return board;
}

function nextTurn(playerTurn, playerCount) {
    return (playerTurn + 1) % playerCount;
}

module.exports = {
    Game,
};