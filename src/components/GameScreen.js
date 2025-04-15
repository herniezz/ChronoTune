// src/components/GameScreen.js

import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import GameForm from './GameForm';
import PopUpCard from './PopUpCard';
import Hearts from './Hearts';
import { CONFIG } from '../config';
import '../App.css';

function GameScreen() {
    const [videoList, setVideoList] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(CONFIG.timerDuration);
    const [hearts, setHearts] = useState(5);
    const [message, setMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        fetch('./playlist/top_teledyski.json')
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
            return;
        }
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const loadNewVideo = (list) => {
        if (!list || list.length === 0) return;
        const video = list[Math.floor(Math.random() * list.length)];
        setCurrentVideo(video);
        setTimeLeft(CONFIG.timerDuration);
    };

    const handleSubmit = (guess) => {
        if (!currentVideo || hearts <= 0) return;
        const guessedYear = parseInt(guess, 10);


        const actualYear = currentVideo.year;
        let points = 0;

        if (guessedYear === actualYear) {
            points = 1;
            setMessage("JAPIDI . gratulacje");
        } else if (Math.abs(guessedYear - actualYear) <= 5) {
            points = 0.5;
            setMessage(`masz tu 0.5 zeby ci smutno nie bylo. rok to ${actualYear}.`);
            setHearts(prev => Math.max(prev - 0.5, 0));
        } else {
            setMessage(`SKIBIDI ALE DEBIL XD rok to ${actualYear}.`);
            setHearts(prev => Math.max(prev - 1, 0));
        }

        setGuesses(prev => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
    };

    const handleSkip = () => {
        if (hearts <= 0) return;
        setGuesses(prev => [...prev, { guess: 'Skipped', points: -1 }]);
        setHearts(prev => Math.max(prev - 1, 0));
        setMessage("pominiety utwor, tracisz 1 punkt");
        setIsPopupVisible(true);
    };

    const handleReset = () => {
        setGuesses([]);
        setHearts(5);
        setMessage('');
        setTimeLeft(CONFIG.timerDuration); // Reset timer
        setIsPopupVisible(false); // Close any popup
        loadNewVideo(videoList); // Load a new video
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (hearts > 0 && timeLeft > 0) {
            loadNewVideo(videoList);
        }
    };

    const handleNextRound = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (hearts > 0 && timeLeft > 0) {
            loadNewVideo(videoList);
        }
    };

    const totalPoints = guesses.reduce(
        (acc, curr) => (curr.points > 0 ? acc + curr.points : acc),
        0
    );

    useEffect(() => {
        if (hearts <= 0 && !isPopupVisible) {
            setMessage("kliknij se zeby zaczac od nowa");
            setIsPopupVisible(true);
        }
    }, [hearts, isPopupVisible]);

    return (
        <>
            <h1 className="title">Guess the Release Year</h1>

            {/* input form */}
            <div className="input-container">
                <GameForm onSubmit={handleSubmit} />
            </div>
            <div className="player-area-container">
                {/* Left-side Skip button */}
                <button className="skip-button" onClick={handleSkip}>Skip</button>

                {/* video container */}
                <div id="player">
                    <VideoPlayer video={currentVideo} ref={videoRef} />
                </div>

                {/* right-side Reset button */}
                <button className="reset-button" onClick={handleReset}>Reset</button>
            </div>

            {/* scoring, timer and hearts */}
            <div className="info-section">
                <div id="score-board">Points: <span>{totalPoints}</span></div>
                <div id="timer-display">Time left: {timeLeft}s</div>
                <Hearts count={hearts} />
            </div>

            {isPopupVisible && (
                <PopUpCard
                    message={message}
                    onClose={handleClosePopup}
                    onNextRound={handleNextRound}
                />
            )}
        </>
    );
}

export default GameScreen;
