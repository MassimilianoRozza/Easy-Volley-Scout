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
    constructor() {
        super();
        this.hash = 0;
        this.plus = 0;
        this.minus = 0;
        this.equals = 0;
    }

    calculateStats() {
        this.totalAttempts = this.hash + this.plus + this.minus + this.equals;
        this.points = 0;
        this.errors = this.equals;
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this.hash + this.plus) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class AttackData extends FundamentalData {
    constructor() {
        super();
        this.hash = 0;
        this.plus = 0;
        this.minus = 0;
        this.equals = 0;
        this.M = 0; // Muro count is still tracked
    }

    calculateStats() {
        this.totalAttempts = this.hash + this.plus + this.minus + this.equals + this.M;
        this.points = this.hash;
        this.errors = this.equals + this.M;
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this.hash + this.plus) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class ServiceData extends FundamentalData {
    constructor() {
        super();
        this.hash = 0;
        this.plus = 0;
        this.minus = 0;
        this.equals = 0;
    }

    calculateStats() {
        this.totalAttempts = this.hash + this.plus + this.minus + this.equals;
        this.points = this.hash;
        this.errors = this.equals;
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this.hash + this.plus) / this.totalAttempts * 100;
        } else {
            this.positivity = 0;
        }
    }
}

class DefenseData extends FundamentalData {
    constructor() {
        super();
        this.hash = 0;
        this.plus = 0;
        this.minus = 0;
        this.equals = 0;
    }

    calculateStats() {
        this.totalAttempts = this.hash + this.plus + this.minus + this.equals;
        this.points = this.hash;
        this.errors = this.equals;
        super.calculateStats();
        if (this.totalAttempts > 0) {
            this.positivity = (this.hash + this.plus) / this.totalAttempts * 100;
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
            this.teamReception.hash += player.reception.hash;
            this.teamReception.plus += player.reception.plus;
            this.teamReception.minus += player.reception.minus;
            this.teamReception.equals += player.reception.equals;

            // Aggregate Attack
            this.teamAttack.hash += player.attack.hash;
            this.teamAttack.plus += player.attack.plus;
            this.teamAttack.minus += player.attack.minus;
            this.teamAttack.equals += player.attack.equals;
            this.teamAttack.M += player.attack.M;

            // Aggregate Service
            this.teamService.hash += player.service.hash;
            this.teamService.plus += player.service.plus;
            this.teamService.minus += player.service.minus;
            this.teamService.equals += player.service.equals;

            // Aggregate Defense
            this.teamDefense.hash += player.defense.hash;
            this.teamDefense.plus += player.defense.plus;
            this.teamDefense.minus += player.defense.minus;
            this.teamDefense.equals += player.defense.equals;
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