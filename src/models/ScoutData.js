// src/models/ScoutData.js

class Athlete {
    constructor(jerseyNumber, name, surname) {
        this.jerseyNumber = jerseyNumber;
        this.name = name;
        this.surname = surname;
    }
}

// Evaluation types for each fundamental
const ReceptionEvaluations = {
    HASH: '#',
    PLUS: '+',
    MINUS: '-',
    EQUALS: '=',
};

const AttackEvaluations = {
    HASH: '#',
    PLUS: '+',
    MINUS: '-',
    EQUALS: '=',
};

const ServiceEvaluations = {
    HASH: '#',
    PLUS: '+',
    MINUS: '-',
    EQUALS: '=',
};

const DefenseEvaluations = {
    HASH: '#',
    PLUS: '+',
    MINUS: '-',
    EQUALS: '=',
};


// Base class for fundamental data, to be extended by specific fundamentals
class FundamentalData {
    constructor() {
        this.totalAttempts = 0;
        this.points = 0;
        this.errors = 0;
        this.efficiency = 0;
        this.positivity = 0;
        this['#'] = 0;
        this['+'] = 0;
        this['-'] = 0;
        this['='] = 0;
    }

    calculateStats() {
        if (this.totalAttempts > 0) {
            this.efficiency = (this.points - this.errors) / this.totalAttempts * 100;
        } else {
            this.efficiency = 0;
        }
    }
}

class ReceptionData extends FundamentalData {
    calculateStats() {
        this.totalAttempts = this['#'] + this['+'] + this['-'] + this['='];
        this.points = 0; // Reception does not generate direct points
        this.errors = this['='];
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this['#'] + this['+']) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class AttackData extends FundamentalData {
    constructor() {
        super();
        this.M = 0; // Muro count is still tracked
    }

    calculateStats() {
        this.totalAttempts = this['#'] + this['+'] + this['-'] + this['='] + this.M;
        this.points = this['#'];
        this.errors = this['='] + this.M;
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this['#'] + this['+']) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class ServiceData extends FundamentalData {
    calculateStats() {
        this.totalAttempts = this['#'] + this['+'] + this['-'] + this['='];
        this.points = this['#'];
        this.errors = this['='];
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this['#'] + this['+']) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class DefenseData extends FundamentalData {
    calculateStats() {
        this.totalAttempts = this['#'] + this['+'] + this['-'] + this['='];
        this.points = this['#']; // A defense that leads to a point
        this.errors = this['=']; // A defense that results in an error
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this['#'] + this['+']) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class PlayerStats {
    constructor(athlete) {
        this.athlete = athlete;
        this.reception = new ReceptionData();
        this.attack = new AttackData();
        this.service = new ServiceData();
        this.defense = new DefenseData();
    }

    calculateAllStats() {
        this.reception.calculateStats();
        this.attack.calculateStats();
        this.service.calculateStats();
        this.defense.calculateStats();
    }
}

class TeamStats {
    constructor() {
        this.players = [];
        this.teamReception = new ReceptionData();
        this.teamAttack = new AttackData();
        this.teamService = new ServiceData();
        this.teamDefense = new DefenseData();
    }

    addPlayer(playerStats) {
        this.players.push(playerStats);
    }

    calculateTeamTotals() {
        this.teamReception = new ReceptionData();
        this.teamAttack = new AttackData();
        this.teamService = new ServiceData();
        this.teamDefense = new DefenseData();

        this.players.forEach(player => {
            player.calculateAllStats();

            // Aggregate Reception
            this.teamReception['#'] += player.reception['#'];
            this.teamReception['+'] += player.reception['+'];
            this.teamReception['-'] += player.reception['-'];
            this.teamReception['='] += player.reception['='];

            // Aggregate Attack
            this.teamAttack['#'] += player.attack['#'];
            this.teamAttack['+'] += player.attack['+'];
            this.teamAttack['-'] += player.attack['-'];
            this.teamAttack['='] += player.attack['='];
            this.teamAttack.M += player.attack.M;

            // Aggregate Service
            this.teamService['#'] += player.service['#'];
            this.teamService['+'] += player.service['+'];
            this.teamService['-'] += player.service['-'];
            this.teamService['='] += player.service['='];

            // Aggregate Defense
            this.teamDefense['#'] += player.defense['#'];
            this.teamDefense['+'] += player.defense['+'];
            this.teamDefense['-'] += player.defense['-'];
            this.teamDefense['='] += player.defense['='];
        });

        this.teamReception.calculateStats();
        this.teamAttack.calculateStats();
        this.teamService.calculateStats();
        this.teamDefense.calculateStats();
    }
}

export {
    Athlete,
    ReceptionEvaluations,
    AttackEvaluations,
    ServiceEvaluations,
    DefenseEvaluations,
    ReceptionData,
    AttackData,
    ServiceData,
    DefenseData,
    PlayerStats,
    TeamStats
};