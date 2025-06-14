// src/App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import MusicChooseScreen from './components/MusicChooseScreen';
import HighscoresScreen from './components/HighscoresScreen';
import './App.css';

function App() {
    const [currentScreen, setCurrentScreen] = useState('home');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Update URL when screen changes
    useEffect(() => {
        const basePath = process.env.PUBLIC_URL || '';
        let newPath = basePath;
        
        switch (currentScreen) {
            case 'home':
                newPath += '/';
                break;
            case 'music-choose':
                newPath += '/music-choose';
                break;
            case 'game':
                newPath += `/game?category=${selectedCategory}`;
                break;
            case 'highscores':
                newPath += '/highscores';
                break;
            default:
                newPath += '/';
        }
        
        if (window.location.pathname !== newPath) {
            window.history.pushState({}, '', newPath);
        }
    }, [currentScreen, selectedCategory]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            const basePath = process.env.PUBLIC_URL || '';
            
            if (path === basePath + '/' || path === basePath) {
                setCurrentScreen('home');
                setSelectedCategory(null);
            } else if (path === basePath + '/music-choose') {
                setCurrentScreen('music-choose');
            } else if (path.includes('/game')) {
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category');
                setSelectedCategory(category);
                setCurrentScreen('game');
            } else if (path === basePath + '/highscores') {
                setCurrentScreen('highscores');
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleStartGame = () => {
        setCurrentScreen('music-choose');
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentScreen('game');
    };

    const handleBackToHome = () => {
        setCurrentScreen('home');
        setSelectedCategory(null);
    };

    const handleBackToMusicChoose = () => {
        setCurrentScreen('music-choose');
    };

    const handleShowHighscores = () => {
        setCurrentScreen('highscores');
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return (
                    <HomeScreen 
                        onStartGame={handleStartGame}
                        onShowHighscores={handleShowHighscores}
                    />
                );
            case 'music-choose':
                return (
                    <MusicChooseScreen 
                        onCategorySelect={handleCategorySelect}
                        onBack={handleBackToHome}
                    />
                );
            case 'game':
                return (
                    <GameScreen 
                        category={selectedCategory}
                        onBack={handleBackToMusicChoose}
                    />
                );
            case 'highscores':
                return (
                    <HighscoresScreen 
                        onBack={handleBackToHome}
                    />
                );
            default:
                return <HomeScreen onStartGame={handleStartGame} onShowHighscores={handleShowHighscores} />;
        }
    };

    return (
        <div className="App">
            {renderScreen()}
        </div>
    );
}

export default App;
