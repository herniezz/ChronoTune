import React, { useState } from 'react';

const GameForm = ({ onSubmit }) => {
    const [guess, setGuess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const year = parseInt(guess, 10);
        if (isNaN(year) || year < 1900 || year > 2100) {
            alert("Please enter a valid year between 1900 and 2100.");
            return;
        }
        onSubmit(guess);
        setGuess('');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input
                    className="input"
                    name="text"
                    type="text"
                    placeholder="Guess the year!"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    pattern="^(19|20)\d{2}$"
                    title="Please enter a valid year between 1900 and 2100."
                />
            </form>
        </div>
    );
};

export default GameForm;