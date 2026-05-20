const BOARD_LENGTH = 44;
const CLOCKWISE = 1;
const COUNTERCLOCKWISE = -1;
const COST_OF_TROPHY = 2000;

function rollOneDie() {
    return Math.floor((Math.random() * 6) + 1);
}

class RealEstate {
    constructor(name, cost, initialRent) {
        this.name = name;
        this.owner = null;
        this.floors = 0;
        this.cost = cost;
        this.initialRent = initialRent;
    }

    calculateRent() {
        let rent = 0;
        let mult = this.floors;
        if (mult >= 4) {
            mult = 3;
        }
        rent = this.initialRent * (mult + 1);
        return rent;
    }

    build() {
        this.floors = this.floors + 1;
    }
}

module.exports = {
    BOARD_LENGTH,
    CLOCKWISE,
    COUNTERCLOCKWISE,
    rollOneDie,
    RealEstate
};