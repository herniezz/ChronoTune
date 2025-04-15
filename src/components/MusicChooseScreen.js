import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function MusicChooseScreen() {
    const [capyMessage, setCapyMessage] = useState("Choose a category to get started!");
    const navigate = useNavigate();

    const handlePolishHover = () => {
        setCapyMessage("Timeless hits straight from Poland. Iconic tracks everyone remembers, cuz polska gurom.");
    };

    const handleDadrockHover = () => {
        setCapyMessage("Legendary rock anthems loved by dads everywhere—prepare for nostalgia overload, or a divorce.");
    };

    const handleSassyHover = () => {
        setCapyMessage("Powerful anthems and pop gems by the queens of sass—confidence guaranteed.");
    };

    const handleHiphopHover = () => {
        setCapyMessage("Iconic beats and bars from hip-hop’s golden ages. Flow into the rhythm!");
    };

    const handlePresidentHover = () => {
        setCapyMessage("I am not sure if you want to hear this, but anyway good luck lmao.");
    };

    const handleMouseLeave = () => {
        setCapyMessage("Choose a category to get started!");
    };

    const handleCategorySelect = (category) => {
        navigate(`/game?category=${category}`);
    };

    return (
        <div className="music-choose-container">
            <h1 className="music-choose-title">Choose your tune</h1>

            <div className="music-choose-buttons">
                <button
                    className="music-option polish-option"
                    onMouseEnter={handlePolishHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCategorySelect('polish')}
                >Polish classics</button>
                <button
                    className="music-option dadrock-option"
                    onMouseEnter={handleDadrockHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCategorySelect('dadrock')}
                >dadrock</button>
                <button
                    className="music-option sassy-option"
                    onMouseEnter={handleSassyHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCategorySelect('sassy')}
                >Sassy gurls</button>
                <button
                    className="music-option hiphop-option"
                    onMouseEnter={handleHiphopHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCategorySelect('hiphop')}
                >Hip-hop tunes</button>
                <button
                    className="music-option president-option"
                    onMouseEnter={handlePresidentHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCategorySelect('president')}
                >presidential election</button>
            </div>

            <div className="bottom-section">
                <div className="capy-message-box">
                    <p className="capy-message">
                        {capyMessage}
                    </p>
                </div>
                <img className="capybara-icon" src="capy2.png" alt="capybara icon" />
            </div>
        </div>
    );
}

export default MusicChooseScreen;