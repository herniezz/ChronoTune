// src/components/HomeScreen.js
import React from 'react';

const HomeScreen = ({ onStartGame, onShowHighscores }) => {
    return (
        <div className="home-container">
            <h1 className="title">Chronotune</h1>
            <p className="subtitle">
                Can you beat the clock? Test your music memory by guessing the release
                years of iconic music videos.
            </p>
            <div className="button-group">
                <button className="home-button" onClick={onStartGame}>
                    Start game
                </button>
                <button className="home-button" onClick={onShowHighscores}>
                    Highscores
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
