import React, { useState, createContext, useEffect } from 'react';
import './App.css';
import AthleteForm from './components/AthleteForm';
import ScoutingInput from './components/ScoutingInput';
import StatisticalReport from './components/StatisticalReport';
import { PlayerStats } from './models/ScoutData';

// --- Icon Components ---
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);


// Create a Theme Context
const ThemeContext = createContext(null);

function App() {
    const [athletes, setAthletes] = useState([]);
    const [playerStatsList, setPlayerStatsList] = useState([]);
    const [matchName, setMatchName] = useState(''); // New state for match name
    const [appStage, setAppStage] = useState('setup'); // 'setup', 'athletes', 'scouting', 'report'
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleImportAthletes = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split(/\r\n|\n|\r/);
            const newAthletes = [];
            const newPlayerStats = [];
            const errors = [];

            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                if (trimmedLine === '') return; // Skip empty lines

                const parts = trimmedLine.split(' ');
                if (parts.length < 2) {
                    errors.push(`Line ${index + 1}: Invalid format. Expected at least jerseyNumber and name.`);
                    return;
                }

                const jerseyNumber = parseInt(parts[0], 10);
                const name = parts[1];
                const surname = parts.slice(2).join(' ') || '';

                if (isNaN(jerseyNumber) || jerseyNumber <= 0) {
                    errors.push(`Line ${index + 1}: Invalid jersey number. Must be a positive number.`);
                    return;
                }
                if (!name) {
                    errors.push(`Line ${index + 1}: Name is mandatory.`);
                    return;
                }

                const existingAthlete = athletes.find(a => a.jerseyNumber === jerseyNumber);
                if (existingAthlete) {
                    errors.push(`Line ${index + 1}: Athlete with jersey number ${jerseyNumber} already exists. Skipping.`);
                    return;
                }

                const athlete = { jerseyNumber, name, surname };
                newAthletes.push(athlete);
                newPlayerStats.push(new PlayerStats(athlete));
            });

            if (newAthletes.length > 0) {
                setAthletes(prevAthletes => [...prevAthletes, ...newAthletes]);
                setPlayerStatsList(prevPlayerStatsList => [...prevPlayerStatsList, ...newPlayerStats]);
                alert(`Successfully imported ${newAthletes.length} athletes.`);
            }

            if (errors.length > 0) {
                alert(`Import completed with errors:\n${errors.join('\n')}`);
            }
            // Clear the file input value so that the same file can be selected again
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    const handleAddAthlete = (newAthlete) => {
        // Check if athlete with same jerseyNumber already exists
        if (athletes.some(athlete => athlete.jerseyNumber === newAthlete.jerseyNumber)) {
            alert(`Athlete with jersey number ${newAthlete.jerseyNumber} already exists.`);
            return; // Exit if duplicate
        }

        // Update states separately to avoid race conditions
        setAthletes([...athletes, newAthlete]);
        setPlayerStatsList([...playerStatsList, new PlayerStats(newAthlete)]);
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
                                        <span className="jersey-number">{athlete.jerseyNumber}</span> - {athlete.name} {athlete.surname}
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
                        <StatisticalReport playerStatsList={playerStatsList} matchName={matchName} />
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
                                    {appStage === 'setup' && <h1>Volleyball Scout App</h1>}
                                    <div className="header-icons">
                                        <input
                                            type="file"
                                            id="importAthletesFile"
                                            accept=".txt,.md"
                                            style={{ display: 'none' }}
                                            onChange={handleImportAthletes}
                                        />
                                        <button
                                            onClick={() => document.getElementById('importAthletesFile').click()}
                                            className="icon-button"
                                            title="Import Athletes"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                        </button>
                                        <button onClick={toggleTheme} className="icon-button">
                                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                        </button>
                                    </div>
                                </header>                <main>
                    {renderContent()}
                </main>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
