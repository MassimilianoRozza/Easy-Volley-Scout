import React, { useState, createContext, useContext } from 'react';
import './App.css';
import AthleteForm from './components/AthleteForm';
import ScoutingInput from './components/ScoutingInput';
import StatisticalReport from './components/StatisticalReport';
import { PlayerStats } from './models/ScoutData';

// Create a Theme Context
const ThemeContext = createContext(null);

function App() {
    const [athletes, setAthletes] = useState([]);
    const [playerStatsList, setPlayerStatsList] = useState([]);
    const [matchName, setMatchName] = useState(''); // New state for match name
    const [appStage, setAppStage] = useState('setup'); // 'setup', 'athletes', 'scouting', 'report'
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
    const [showReport, setShowReport] = useState(false); // New state for report visibility

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleAddAthlete = (newAthlete) => {
        setAthletes((prevAthletes) => {
            // Check if athlete with same jerseyNumber already exists
            if (!prevAthletes.some(athlete => athlete.jerseyNumber === newAthlete.jerseyNumber)) {
                const updatedAthletes = [...prevAthletes, newAthlete];
                setPlayerStatsList((prevPlayerStatsList) => [
                    ...prevPlayerStatsList,
                    new PlayerStats(newAthlete)
                ]);
                return updatedAthletes;
            }
            alert(`Athlete with jersey number ${newAthlete.jerseyNumber} already exists.`);
            return prevAthletes; // Return original athletes if duplicate
        });
    };

    const handleUpdatePlayerStats = (updatedPlayerStats) => {
        setPlayerStatsList((prevPlayerStatsList) =>
            prevPlayerStatsList.map((ps) =>
                ps.athlete.jerseyNumber === updatedPlayerStats.athlete.jerseyNumber
                    ? updatedPlayerStats
                    : ps
            )
        );
    };

    const renderContent = () => {
        switch (appStage) {
            case 'setup':
                return (
                    <div>
                        <h2>Match Setup</h2>
                        <div>
                            <label htmlFor="matchName">Match Name:</label>
                            <input
                                type="text"
                                id="matchName"
                                value={matchName}
                                onChange={(e) => setMatchName(e.target.value)}
                                placeholder="e.g., Vs. Opponent Team"
                            />
                        </div>
                        <button onClick={() => setAppStage('athletes')}>Next: Manage Athletes</button>
                    </div>
                );
            case 'athletes':
                return (
                    <>
                        <AthleteForm onAddAthlete={handleAddAthlete} />

                        <h2>Registered Athletes</h2>
                        {athletes.length === 0 ? (
                            <p>No athletes registered yet.</p>
                        ) : (
                            <ul>
                                {athletes.map((athlete, index) => (
                                    <li key={index}>
                                        #{athlete.jerseyNumber} - {athlete.name} {athlete.surname}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button onClick={() => setAppStage('setup')}>Back to Setup</button>
                        <button onClick={() => setAppStage('scouting')} disabled={athletes.length === 0}>Next: Scouting</button>
                    </>
                );
            case 'scouting':
                return (
                    <>
                        {athletes.length > 0 && (
                            <ScoutingInput
                                athletes={athletes}
                                playerStatsList={playerStatsList}
                                onUpdatePlayerStats={handleUpdatePlayerStats}
                            />
                        )}
                        <button onClick={() => setAppStage('athletes')}>Back to Athletes</button>
                        <button onClick={() => setAppStage('report')}>View Report</button>
                    </>
                );
            case 'report':
                return (
                    <>
                        <button onClick={() => setShowReport(!showReport)}>
                            {showReport ? 'Hide Report' : 'Show Report'}
                        </button>
                        {showReport && <StatisticalReport playerStatsList={playerStatsList} matchName={matchName} />}
                        <button onClick={() => setAppStage('scouting')}>Back to Scouting</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={`App ${theme}-theme`}>
                <header className="App-header">
                    <h1>Volleyball Scout App</h1>
                    <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Theme</button>
                </header>
                <main>
                    {renderContent()}


                </main>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
