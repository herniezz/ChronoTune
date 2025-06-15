import React, { useState } from 'react';

const GameForm = ({ onSubmit }) => {
    const [guess, setGuess] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check validation before submitting
        const year = parseInt(guess, 10);
        if (isNaN(year) || year < 1950 || year > 2025) {
            setError(true);
            return;
        }

        setError(false);
        onSubmit(guess);
        setGuess('');
    };

    const handleChange = (e) => {
        setGuess(e.target.value);
        setError(false);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input
                    className={`input ${error ? 'input-error' : ''}`}
                    name="text"
                    type="text"
                    placeholder="Guess the year!"
                    value={guess}
                    onChange={handleChange}
                />
                {error && (
                    <div className="error-message">
                        Hey! Stop it! You can't guess the year like that. Please enter a valid year between 1950 and 2025.
                    </div>
                )}
            </form>
        </div>
    );
};

export default GameForm;