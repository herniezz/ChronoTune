// src/components/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import GameForm from './GameForm';
import PopUpCard from './PopUpCard';
import Hearts from './Hearts';
import { CONFIG } from '../config';
import '../App.css';

function GameScreen() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category') || 'polish';
    const [videoList, setVideoList] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(CONFIG.timerDuration);
    const [hearts, setHearts] = useState(5);
    const [message, setMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const playerRef = useRef(null);

    useEffect(() => {
        let playlistFile;
        switch(category) {
            case 'polish':
                playlistFile = 'top_teledyski';
                break;
            case 'president':
                playlistFile = 'elections';
                break;
            case 'dadrock':
            case 'sassy':
            case 'hiphop':
                playlistFile = category;
                break;
            default:
                playlistFile = 'top_teledyski';
        }

        fetch(`./playlist/${playlistFile}.json`)
            .then((res) => res.json())
            .then((data) => {
                setVideoList(data);
                loadNewVideo(data);
            })
            .catch((err) => console.error(err));
    }, [category]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setMessage("Time up! You lose a heart.");
            setIsPopupVisible(true);
            return;
        }

        // Only decrement timer if video is not paused
        if (!isPaused) {
            const interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLeft, isPaused]);

    // YouTube player event handlers
    const onPlayerReady = (event) => {
        playerRef.current = event.target;
    };

    const onPlayerStateChange = (event) => {
        // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
        setIsPaused(event.data === 2); // 2 means paused
    };

    const youtubeOpts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
        },
    };

    const loadNewVideo = (list) => {
        if (!list || list.length === 0) return;
        const video = list[Math.floor(Math.random() * list.length)];
        setCurrentVideo(video);
        setTimeLeft(CONFIG.timerDuration);
        setIsPaused(false);
    };

    const handleSubmit = (guess) => {
        if (!currentVideo || hearts <= 0) return;
        const guessedYear = parseInt(guess, 10);

        const actualYear = currentVideo.year;
        let points = 0;

        if (guessedYear === actualYear) {
            points = 1;
            setMessage("Nice, you did it!");
        } else if (Math.abs(guessedYear - actualYear) <= 2) {
            points = 0.5;
            setMessage(`Alright, close guess. Year is ${actualYear}, but you get half a point.`);
            setHearts(prev => Math.max(prev - 0.5, 0));
        } else {
            setMessage(`uh oh, not right. The answer is ${actualYear}.`);
            setHearts(prev => Math.max(prev - 1, 0));
        }

        setGuesses(prev => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
    };

    const handleSkip = () => {
        if (hearts <= 0) return;
        setGuesses(prev => [...prev, { guess: 'Skipped', points: -1 }]);
        setHearts(prev => Math.max(prev - 1, 0));
        setMessage("Omg!");
        setIsPopupVisible(true);
    };

    const handleReset = () => {
        setGuesses([]);
        setHearts(5);
        setMessage('');
        setTimeLeft(CONFIG.timerDuration);
        setIsPopupVisible(false);
        loadNewVideo(videoList);
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
            {/* input form */}
            <div className="input-container">
                <GameForm onSubmit={handleSubmit} />
            </div>
            <div className="player-area-container">
                {/* Left-side Skip button */}
                <button className="skip-button" onClick={handleSkip}>Skip</button>

                {/* YouTube player */}
                <div id="player">
                    {currentVideo && (
                        <YouTube
                            videoId={currentVideo.youtube_id}
                            opts={youtubeOpts}
                            onReady={onPlayerReady}
                            onStateChange={onPlayerStateChange}
                        />
                    )}
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