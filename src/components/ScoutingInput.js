import React, { useState, useEffect } from 'react';
import {
    ReceptionEvaluations,
    AttackEvaluations,
    ServiceEvaluations,
    DefenseEvaluations,
    PlayerStats,
    ReceptionData,
    AttackData,
    ServiceData,
    DefenseData
} from '../models/ScoutData';

// Helper to get all evaluation keys for a given fundamental
const getEvaluationKeysForFundamental = (fundamentalName) => {
    switch (fundamentalName) {
        case 'reception':
            return Object.values(ReceptionEvaluations);
        case 'attack':
            return Object.values(AttackEvaluations);
        case 'service':
            return Object.values(ServiceEvaluations);
        case 'defense':
            return Object.values(DefenseEvaluations);
        default:
            return [];
    }
};

// Helper to get all fundamental names in the order specified by the user's image
const allFundamentals = ['service', 'reception', 'defense', 'attack'];

function ScoutingInput({ athletes, playerStatsList, onUpdatePlayerStats }) {
    const [selectedAthleteForScouting, setSelectedAthleteForScouting] = useState(null);
    const [currentEvaluationCounts, setCurrentEvaluationCounts] = useState({});

    useEffect(() => {
        if (selectedAthleteForScouting) {
            const playerStats = playerStatsList.find(ps => ps.athlete.jerseyNumber === parseInt(selectedAthleteForScouting.jerseyNumber));
            if (playerStats) {
                const initialCounts = {};
                allFundamentals.forEach(fundamentalName => {
                    const data = playerStats[fundamentalName];
                    const fundamentalCounts = {};
                    const evaluationKeys = getEvaluationKeysForFundamental(fundamentalName);
                    evaluationKeys.forEach(key => {
                        fundamentalCounts[key] = data[key] || 0;
                    });
                    initialCounts[fundamentalName] = fundamentalCounts;
                });
                setCurrentEvaluationCounts(initialCounts);
            }
        } else {
            setCurrentEvaluationCounts({});
        }
    }, [selectedAthleteForScouting, playerStatsList]);

    const handleCountChange = (fundamentalName, evaluationKey, increment) => {
        setCurrentEvaluationCounts(prevCounts => {
            const newCounts = {
                ...prevCounts,
                [fundamentalName]: {
                    ...prevCounts[fundamentalName],
                    [evaluationKey]: Math.max(0, (prevCounts[fundamentalName]?.[evaluationKey] || 0) + (increment ? 1 : -1))
                }
            };

            // Auto-save: Construct updated PlayerStats and call onUpdatePlayerStats
            const playerStats = playerStatsList.find(ps => ps.athlete.jerseyNumber === parseInt(selectedAthleteForScouting.jerseyNumber));
            if (playerStats) {
                const updatedPlayerStats = new PlayerStats(playerStats.athlete);
                updatedPlayerStats.reception = { ...playerStats.reception };
                updatedPlayerStats.attack = { ...playerStats.attack };
                updatedPlayerStats.service = { ...playerStats.service };
                updatedPlayerStats.defense = { ...playerStats.defense };

                allFundamentals.forEach(fundName => {
                    if (newCounts[fundName]) {
                        Object.keys(newCounts[fundName]).forEach(key => {
                            updatedPlayerStats[fundName][key] = newCounts[fundName][key];
                        });
                    }
                });
                onUpdatePlayerStats(updatedPlayerStats);
                setSelectedAthleteForScouting(null); // Return to player grid after modification
            }
            return newCounts;
        });
    };

    // handleSubmit is no longer needed for saving, but the form structure remains
    const handleSubmit = (event) => {
        event.preventDefault();
        // No explicit save action needed here anymore, as changes are saved on counter modification
        alert('Changes saved automatically!');
    };

    const renderScoutingTable = () => {
        const allEvaluationKeys = [...new Set([
            ...Object.values(ReceptionEvaluations),
            ...Object.values(AttackEvaluations),
            ...Object.values(ServiceEvaluations),
            ...Object.values(DefenseEvaluations)
        ])].sort();

        return (
            <form onSubmit={handleSubmit} className="scouting-table-form">
                <button type="button" onClick={() => setSelectedAthleteForScouting(null)}>Change Athlete</button>
                <h3>Currently Scouting: #{selectedAthleteForScouting.jerseyNumber} {selectedAthleteForScouting.name} {selectedAthleteForScouting.surname}</h3>

                <table className="scouting-evaluation-table">
                    <thead>
                        <tr>
                            <th>Fundamental</th>
                            {allEvaluationKeys.map(key => <th key={key}>{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {allFundamentals.map(fundamentalName => (
                            <tr key={fundamentalName}>
                                <td>{fundamentalName.charAt(0).toUpperCase() + fundamentalName.slice(1)}</td>
                                {allEvaluationKeys.map(evaluationKey => (
                                    <td key={evaluationKey}>
                                        {getEvaluationKeysForFundamental(fundamentalName).includes(evaluationKey) ? (
                                            <div className="evaluation-input-cell">
                                                <button type="button" className="increment-button" onClick={() => handleCountChange(fundamentalName, evaluationKey, true)}>+</button>
                                                <span>{currentEvaluationCounts[fundamentalName]?.[evaluationKey] || 0}</span>
                                                <button type="button" className="decrement-button" onClick={() => handleCountChange(fundamentalName, evaluationKey, false)}>-</button>
                                            </div>
                                        ) : (
                                            <span>-</span> // Not applicable for this fundamental
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Dedicated Muro button removed as per user request */}
                {/* The submit button is still here, but its primary function for saving is now handled by handleCountChange */}
                <button type="submit">Finish Scouting (Optional)</button>
            </form>
        );
    };

    return (
        <div className="scouting-input-container">
            <h2>Scouting Input</h2>

            {!selectedAthleteForScouting ? (
                <div className="athlete-selection-grid">
                    <h3>Select an Athlete to Scout</h3>
                    <div className="athlete-grid-container">
                        {athletes.map(athlete => (
                            <div key={athlete.jerseyNumber} className="athlete-grid-item" onClick={() => setSelectedAthleteForScouting(athlete)}>
                                <h4>#{athlete.jerseyNumber}</h4>
                                <p>{athlete.name} {athlete.surname}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                renderScoutingTable()
            )}
        </div>
    );
}

export default ScoutingInput;