// src/components/HomeScreen.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomeScreen() {
    return (
        <div className="home-container">
            <h1 className="title">Chronotune</h1>
            <p className="subtitle">
                Can you beat the clock? Test your music memory by guessing the release
                years of iconic music videos.
            </p>
            <div className="button-group">
                <Link to="/music-choose" className="home-button">
                    Start game
                </Link>
                <Link to="/highscores" className="home-button">
                    Highscores
                </Link>
            </div>
        </div>
    );
}

export default HomeScreen;
