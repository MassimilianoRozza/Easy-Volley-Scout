import React, { useState, useEffect } from 'react';
import {
    ReceptionEvaluations,
    AttackEvaluations,
    ServiceEvaluations,
    DefenseEvaluations,
    PlayerStats
} from '../models/ScoutData';

const getEvaluationKeysForFundamental = (fundamentalName) => {
    switch (fundamentalName) {
        case 'reception': return Object.values(ReceptionEvaluations);
        case 'attack': return Object.values(AttackEvaluations);
        case 'service': return Object.values(ServiceEvaluations);
        case 'defense': return Object.values(DefenseEvaluations);
        default: return [];
    }
};

const allFundamentals = ['service', 'reception', 'defense', 'attack'];

function ScoutingInput({ athletes, playerStatsList, onUpdatePlayerStats }) {
    const [selectedAthleteForScouting, setSelectedAthleteForScouting] = useState(null);
    const [currentEvaluationCounts, setCurrentEvaluationCounts] = useState({});

    useEffect(() => {
        if (selectedAthleteForScouting) {
            const playerStats = playerStatsList.find(ps => ps.athlete.jerseyNumber === selectedAthleteForScouting.jerseyNumber);
            if (playerStats) {
                const initialCounts = {};
                allFundamentals.forEach(fundamentalName => {
                    const data = playerStats[fundamentalName];
                    const fundamentalCounts = {};
                    getEvaluationKeysForFundamental(fundamentalName).forEach(key => {
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
        setCurrentEvaluationCounts(prevCounts => ({
            ...prevCounts,
            [fundamentalName]: {
                ...prevCounts[fundamentalName],
                [evaluationKey]: Math.max(0, (prevCounts[fundamentalName]?.[evaluationKey] || 0) + (increment ? 1 : -1))
            }
        }));
    };

    const handleSaveAndClose = () => {
        const playerStats = playerStatsList.find(ps => ps.athlete.jerseyNumber === selectedAthleteForScouting.jerseyNumber);
        if (playerStats) {
            const newPlayerStats = new PlayerStats(playerStats.athlete);

            allFundamentals.forEach(fundName => {
                const counts = currentEvaluationCounts[fundName];
                if (counts) {
                    const fundamentalDataObject = newPlayerStats[fundName];
                    for (const key in counts) {
                        if (Object.hasOwnProperty.call(counts, key)) {
                            fundamentalDataObject[key] = counts[key];
                        }
                    }
                }
            });

            onUpdatePlayerStats(newPlayerStats);
            setSelectedAthleteForScouting(null);
        }
    };

    const allEvaluationKeys = [...new Set([
        ...Object.values(ReceptionEvaluations),
        ...Object.values(AttackEvaluations),
        ...Object.values(ServiceEvaluations),
        ...Object.values(DefenseEvaluations)
    ])].sort();

    return (
        <div className="scouting-input-container">
            <h2>Scouting Input</h2>

            <div className="athlete-selection-grid">
                <h3>Select an Athlete to Scout</h3>
                <div className="athlete-grid-container">
                    {athletes.map(athlete => (
                        <div key={athlete.jerseyNumber} className="athlete-grid-item" onClick={() => setSelectedAthleteForScouting(athlete)}>
                            <h4><span className="jersey-number">{athlete.jerseyNumber}</span></h4>
                            <p>{athlete.name} {athlete.surname}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAthleteForScouting && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setSelectedAthleteForScouting(null)}>&times;</span>
                        <h3>Currently Scouting: #{selectedAthleteForScouting.jerseyNumber} {selectedAthleteForScouting.name} {selectedAthleteForScouting.surname}</h3>
                        <table className="common-table">
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
                                                    <span>-</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSaveAndClose} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>Save and Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScoutingInput;