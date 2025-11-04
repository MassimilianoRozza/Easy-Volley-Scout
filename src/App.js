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

const FullscreenEnterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
);

const FullscreenExitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
);


// Create a Theme Context
const ThemeContext = createContext(null);

function App() {
    const [athletes, setAthletes] = useState([]);
    const [playerStatsList, setPlayerStatsList] = useState([]);
    const [matchName, setMatchName] = useState(''); // New state for match name
    const [appStage, setAppStage] = useState('setup'); // 'setup', 'athletes', 'scouting', 'report'
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
    const [showReport, setShowReport] = useState(false); // New state for report visibility
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
                    <div className="header-icons">
                        <button onClick={toggleFullScreen} className="icon-button">
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                        </button>
                        <button onClick={toggleTheme} className="icon-button">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
