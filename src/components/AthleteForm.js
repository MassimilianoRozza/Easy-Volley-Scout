import React, { useState, useContext } from 'react';
import { Athlete, PlayerStats } from '../models/ScoutData';
import { LanguageContext } from '../App';

function AthleteForm({ onAddAthlete, setAthletes, setPlayerStatsList }) {
    const { t } = useContext(LanguageContext);
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!jerseyNumber) {
            alert(t('jerseyNumberRequired'));
            return;
        }

        const num = parseInt(jerseyNumber, 10);

        if (isNaN(num) || num < 1 || num > 99 || jerseyNumber.includes('.') || jerseyNumber.includes(',')) {
            alert(t('jerseyNumberInvalid'));
            return;
        }

        const newAthlete = new Athlete(jerseyNumber, name, surname);
        onAddAthlete(newAthlete);
        setJerseyNumber('');
        setName('');
        setSurname('');
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
                    errors.push(t('invalidFormat', { lineNumber: index + 1 }));
                    return;
                }

                const jerseyNumber = parseInt(parts[0], 10);
                const name = parts[1];
                const surname = parts.slice(2).join(' ') || '';

                if (isNaN(jerseyNumber) || jerseyNumber <= 0) {
                    errors.push(t('invalidJerseyNumber', { lineNumber: index + 1 }));
                    return;
                }
                if (!name) {
                    errors.push(t('nameMandatory', { lineNumber: index + 1 }));
                    return;
                }

                // Check for duplicates against current athletes in App.js state
                // This requires passing current athletes state or a checker function
                // For now, we'll assume onAddAthlete handles duplicates or we pass athletes prop
                // Given the current setup, onAddAthlete will handle the alert for duplicates
                // We need to check against the current state of athletes, not just newAthletes
                // This means AthleteForm needs access to the current athletes list from App.js
                // For simplicity, I'll assume onAddAthlete will handle the duplicate check and alert.
                // If onAddAthlete is called for each, it will alert individually.
                // A better approach would be to pass the current athletes list to AthleteForm
                // and do the check here before calling onAddAthlete for each.

                const athlete = { jerseyNumber, name, surname };
                newAthletes.push(athlete);
                newPlayerStats.push(new PlayerStats(athlete));
            });

            if (newAthletes.length > 0) {
                setAthletes(prevAthletes => {
                    const uniqueNewAthletes = newAthletes.filter(newA => !prevAthletes.some(existingA => existingA.jerseyNumber === newA.jerseyNumber));
                    if (uniqueNewAthletes.length < newAthletes.length) {
                        // Some duplicates were filtered out, add a warning to errors
                        errors.push(t('someAthletesSkippedDueToDuplicates'));
                    }
                    return [...prevAthletes, ...uniqueNewAthletes];
                });
                setPlayerStatsList(prevPlayerStatsList => {
                    const uniqueNewPlayerStats = newPlayerStats.filter(newPS => !prevPlayerStatsList.some(existingPS => existingPS.athlete.jerseyNumber === newPS.athlete.jerseyNumber));
                    return [...prevPlayerStatsList, ...uniqueNewPlayerStats];
                });
                alert(t('importSuccess', { count: newAthletes.length }));
            }

            if (errors.length > 0) {
                alert(t('importErrors', { errors: errors.join('\n') }));
            }
            // Clear the file input value so that the same file can be selected again
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>{t('athleteFormTitle')}</h2>
                <input
                    type="file"
                    id="importAthletesFile"
                    accept=".txt,.md"
                    style={{ display: 'none' }}
                    onChange={handleImportAthletes}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById('importAthletesFile').click()}
                    className="icon-button"
                    title={t('importAthletes')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
            </div>
            <div>
                <label htmlFor="jerseyNumber">{t('jerseyNumber')}</label>
                <input
                    type="number"
                    id="jerseyNumber"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="name">{t('name')}</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="surname">{t('surname')}</label>
                <input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
            </div>
            <button type="submit">{t('addAthlete')}</button>
        </form>
    );
}

export default AthleteForm;