import React, { useState } from 'react';

const MusicChooseScreen = ({ onCategorySelect, onBack }) => {
    const [capyMessage, setCapyMessage] = useState("Choose a category to get started!");
    const [hoverMessage, setHoverMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

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
        setCapyMessage("Iconic beats and bars from hip-hop's golden ages. Flow into the rhythm!");
    };

    const handlePresidentHover = () => {
        setCapyMessage("I am not sure if you want to hear this, but anyway good luck lmao.");
    };

    const handleMetalHover = () => {
        setCapyMessage("Heavy riffs, thunderous drums, and epic solos. Time to headbang! YEYEEAH");
    };

    const handleNumetalHover = () => {
        setCapyMessage("Keep rolling rolling rolling YEAH... of course if you can");
    };

    const handleMouseLeave = () => {
        setCapyMessage("Choose a category to get started!");
    };

    const handleHover = (message) => {
        setHoverMessage(message);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="music-choose-container">
            <h1 className="music-choose-title">Choose your tune</h1>
            
            <div className="music-choose-buttons">
                <button
                    className="music-option polish-option"
                    onMouseEnter={handlePolishHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('polish')}
                >Polish classics</button>
                <button
                    className="music-option dadrock-option"
                    onMouseEnter={handleDadrockHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('dadrock')}
                >Dad Rock</button>
                <button
                    className="music-option sassy-option"
                    onMouseEnter={handleSassyHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('sassy')}
                >Sassy</button>
                <button
                    className="music-option hiphop-option"
                    onMouseEnter={handleHiphopHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('hiphop')}
                >Hip Hop</button>
                <button
                    className="music-option president-option"
                    onMouseEnter={handlePresidentHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('president')}
                >presidential election</button>
                <button
                    className="music-option metal-option"
                    onMouseEnter={handleMetalHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('metal')}
                >Metal</button>
                <button
                    className="music-option numetal-option"
                    onMouseEnter={handleNumetalHover}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCategorySelect('numetal')}
                >Nu Metal</button>
            </div>

            <div className="bottom-section">
                <div className="capy-message-box">
                    <p className="capy-message">
                        {capyMessage}
                    </p>
                </div>
                <img className="capybara-icon" src={`${process.env.PUBLIC_URL || ''}/capy2.png`} alt="capybara icon" />
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="home-button" onClick={onBack}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default MusicChooseScreen;