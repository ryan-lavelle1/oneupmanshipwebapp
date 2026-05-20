const {
    BOARD_LENGTH,
    CLOCKWISE,
    COUNTERCLOCKWISE,
    BONUS_AMOUNT,
    rollOneDie,
    RealEstate
} = require('./Shared');

class Space {
    constructor(id, stockChange, direction) {
        this.id = id;
        this.type = "Space";
        this.stockChange = stockChange;
        this.direction = direction;
    }

    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }

    passEffect(game, player) {}
}

class StockSpace extends Space {
    constructor(id, companyName, dividend, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "StockSpace";
        this.companyName = companyName;
        this.dividend = dividend;
    }

    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class ShareholderMeetingSpace extends Space {
    constructor(id, companyName, dividend, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "ShareholderMeetingSpace";
        this.companyName = companyName;
        this.dividend = dividend;
    }

    landEffect(game, player) {
        super.landEffect(game, player);

        const die = rollOneDie();
        const shares = player.stocks[this.companyName];
        player.stocks[this.companyName] = shares * die;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class RealEstateSpace extends Space {
    constructor(id, realEstate, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "RealEstateSpace";
        this.realEstate = realEstate;
    }

    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class BonusSpace extends Space {
    constructor(id, bonusAmount) {
        super(id, 0, CLOCKWISE);
        this.type = "BonusSpace";
        this.bonusAmount = bonusAmount;
    }

    passEffect(game, player) {
        player.cash = player.cash + this.bonusAmount;
    }

    landEffect(game, player) {
        player.chooseDirection = true;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class DollarSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "DollarSpace";
    }
    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class TrophySpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "TrophySpace";
    }
    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class BrokerFeeSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "BrokerFeeSpace";
    }
    landEffect(game, player) {
        const payment = player.shareCount() * 10;
        player.cash = player.cash - payment;
        game.freeLunch = game.freeLunch + payment;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class BlackThursdaySpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "BlackThursdaySpace";
    }
    landEffect(game, player) {
        const payment = player.shareCount() * 10;
        player.cash = player.cash - payment;
        game.freeLunch = game.freeLunch + payment;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class TaxmanComethSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "TaxmanComethSpace";
    }
    landEffect(game, player) {
        const payment = Math.floor(player.cashOutValue(game.stockTracker) * 0.2);
        player.cash = player.cash - payment;
        game.freeLunch = game.freeLunch + payment;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class FreeLunchSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "FreeLunchSpace";
    }
    landEffect(game, player) {
        player.cash = player.cash + game.freeLunch;
        game.freeLunch = 0;

        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class VegasSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "VegasSpace";
    }
    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class DoOrDieSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "DoOrDieSpace";
    }
    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

class WildCardSpace extends Space {
    constructor(id, stockChange, direction) {
        super(id, stockChange, direction);
        this.type = "WildCardSpace";
    }

    landEffect(game, player) {
        game.stockTracker.changeStockPrice(this.stockChange);
        player.direction = this.direction;
    }
}

module.exports = {
    Space,
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
};