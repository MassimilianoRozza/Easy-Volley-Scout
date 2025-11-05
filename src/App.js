import React, { useState, createContext } from 'react';
import './App.css';
import AthleteForm from './components/AthleteForm';
import ScoutingInput from './components/ScoutingInput';
import StatisticalReport from './components/StatisticalReport';
import { PlayerStats } from './models/ScoutData';
import translations from './translations';

// --- Icon Components ---
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);


// Create a Theme Context
const ThemeContext = createContext(null);
export const LanguageContext = createContext(null);

function App() {
    const [athletes, setAthletes] = useState([]);
    const [playerStatsList, setPlayerStatsList] = useState([]);
    const [matchName, setMatchName] = useState(''); // New state for match name
    const [appStage, setAppStage] = useState('setup'); // 'setup', 'athletes', 'scouting', 'report'
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
    const [language, setLanguage] = useState('it'); // 'it' or 'en'

    const t = (key, vars) => {
        let text = translations[language][key] || key;
        if (vars) {
            for (const [k, value] of Object.entries(vars)) {
                text = text.replace(`{${k}}`, value);
            }
        }
        return text;
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleAddAthlete = (newAthlete) => {
        // Check if athlete with same jerseyNumber already exists
        if (athletes.some(athlete => athlete.jerseyNumber === newAthlete.jerseyNumber)) {
            alert(t('jerseyNumberExists', { jerseyNumber: newAthlete.jerseyNumber }));
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
                        <h2>{t('matchSetup')}</h2>
                        <div>
                            <label htmlFor="language-select">{t('language')}:</label>
                            <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="it">{t('it')}</option>
                                <option value="en">{t('en')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="matchName">{t('matchName')}</label>
                            <input
                                type="text"
                                id="matchName"
                                value={matchName}
                                onChange={(e) => setMatchName(e.target.value)}
                                placeholder={t('matchNamePlaceholder')}
                            />
                        </div>
                        <button onClick={() => setAppStage('athletes')}>{t('nextManageAthletes')}</button>
                    </div>
                );
            case 'athletes':
                return (
                    <>
                        <AthleteForm onAddAthlete={handleAddAthlete} setAthletes={setAthletes} setPlayerStatsList={setPlayerStatsList} />

                        <h2>{t('registeredAthletes')}</h2>
                        {athletes.length === 0 ? (
                            <p>{t('noAthletesRegistered')}</p>
                        ) : (
                            <ul>
                                {athletes.map((athlete, index) => (
                                    <li key={index}>
                                        <span className="jersey-number">{athlete.jerseyNumber}</span> - {athlete.name} {athlete.surname}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button onClick={() => setAppStage('setup')}>{t('backToSetup')}</button>
                        <button onClick={() => setAppStage('scouting')} disabled={athletes.length === 0}>{t('nextScouting')}</button>
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
            <LanguageContext.Provider value={{ language, setLanguage, t }}>
                <div className={`App ${theme}-theme`}>
                    {appStage !== 'scouting' && appStage !== 'report' && (
                        <header className="App-header">
                            {appStage === 'setup' && <h1>{t('appName')}</h1>}
                            <div className="header-icons">
                                <button onClick={toggleTheme} className="icon-button">
                                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                </button>
                            </div>
                        </header>
                    )}
                    <main>
                        {renderContent()}
                    </main>
                </div>
            </LanguageContext.Provider>
        </ThemeContext.Provider>
    );
}

export default App;
