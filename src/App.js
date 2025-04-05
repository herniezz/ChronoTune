import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import GameForm from './components/GameForm';
import PopUpCard from './components/PopUpCard';
import { CONFIG } from './config';
import './App.css';

function App() {
    const [videoList, setVideoList] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(CONFIG.timerDuration);
    const [health, setHealth] = useState(1000);
    const [message, setMessage] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        fetch('/playlist/dadrock.json')
            .then((res) => res.json())
            .then((data) => {
                setVideoList(data);
                loadNewVideo(data);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            setMessage("bardzo sie starales ale z gry wyleciales");
            setIsPopupVisible(true);
            loadNewVideo(videoList);
            return;
        }
        if (isPaused) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, videoList, isPaused]);

    const loadNewVideo = (list) => {
        if (!list || list.length === 0) return;
        const video = list[Math.floor(Math.random() * list.length)];
        setCurrentVideo(video);
        setTimeLeft(CONFIG.timerDuration);
    };

    const handleSubmit = (guess) => {
        if (!currentVideo || health <= 0) return;
        const guessedYear = parseInt(guess, 10);
        const actualYear = currentVideo.year;
        let points = 0;

        if (guessedYear === actualYear) {
            points = 1;
            setMessage("JAPIDI . gratulacje");
        } else if (Math.abs(guessedYear - actualYear) <= 5) {
            points = 0.5;
            setMessage(`masz tu 0.5 zeby ci smutno nie bylo. rok to ${actualYear}.`);
            setHealth(prev => Math.max(prev - 50, 0)); // Reduce health by 50 for close guesses
        } else {
            setMessage(`SKIBIDI ALE DEBIL XD rok to ${actualYear}.`);
            setHealth(prev => Math.max(prev - 100, 0)); // Reduce health by 100 for wrong guesses
        }

        setGuesses(prev => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
        loadNewVideo(videoList);
    };

    const handleSkip = () => {
        if (health <= 0) return;
        setGuesses(prev => [...prev, { guess: 'Skipped', points: -0.25 }]);
        setHealth(prev => Math.max(prev - 50, 0)); // Reduce health by 50 for each skip
        setMessage("pominiety utwor, tracisz 0.25");
        setIsPopupVisible(true);
        loadNewVideo(videoList);
    };

    const handleReset = () => {
        setGuesses([]);
        setHealth(1000);
        setMessage('');
    };

    const handlePause = () => {
        setIsPaused(prev => !prev);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setMessage('');
    };

    const totalPoints = guesses.reduce((acc, curr) => acc + curr.points, 0);

    useEffect(() => {
        if (health <= 0) {
            setMessage("kliknij se zeby zaczac od nowa");
            setIsPopupVisible(true);
        }
    }, [health]);

    return (
        <div className="App">
            <h1 style={{ color: 'var(--azure-web)'}}>Guess the Release Year</h1>
            <div id="player">
                <VideoPlayer video={currentVideo} />
            </div>
            <GameForm onSubmit={handleSubmit} />
            <div id="score-board">Points: <span>{totalPoints}</span></div>
            <div id="timer-display">Time left: {timeLeft}s</div>
            <div className="health-bar" data-total="1000" data-value={health}>
                <div className="bar" style={{ width: `${(health / 1000) * 100}%` }}>
                    <div className="hit"></div>
                </div>
            </div>
            <button onClick={handleSkip}>Skip Song (-0.25 points)</button>
            <button onClick={handleReset}>Reset Score</button>
            <button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
            {isPopupVisible && <PopUpCard message={message} onClose={handleClosePopup} />}
        </div>
    );
}

export default App;