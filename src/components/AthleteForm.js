// src/components/AthleteForm.js
import React, { useState } from 'react';
import { Athlete } from '../models/ScoutData';

function AthleteForm({ onAddAthlete }) {
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (jerseyNumber) { // Only jerseyNumber is required now
            const newAthlete = new Athlete(jerseyNumber, name, surname);
            onAddAthlete(newAthlete);
            setJerseyNumber('');
            setName('');
            setSurname('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Athlete</h2>
            <div>
                <label htmlFor="jerseyNumber">Jersey Number:</label>
                <input
                    type="number"
                    id="jerseyNumber"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="surname">Surname:</label>
                <input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
            </div>
            <button type="submit">Add Athlete</button>
        </form>
    );
}

export default AthleteForm;