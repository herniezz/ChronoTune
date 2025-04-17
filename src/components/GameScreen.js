// src/components/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import GameForm from './GameForm';
import PopUpCard from './PopUpCard';
import Hearts from './Hearts';
import { CONFIG } from '../config';
import '../App.css';
import { VideoErrorProvider, useVideoError } from '../utils/errorHandlers';

function GameScreen() {
    return (
        <VideoErrorProvider>
            <GameScreenContent />
        </VideoErrorProvider>
    );
}

function GameScreenContent() {
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
    const { setVideoError, handlePlayerError } = useVideoError();
    const [skipped, setSkipped] = useState(false);

    useEffect(() => {
        let playlistFile;
        switch (category) {
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
                console.log("Playlist loaded:", data);
                loadNewVideo(data);
            })
            .catch((err) => console.error("Error loading playlist:", err));
    }, [category]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setMessage("Time up! You lose a heart.");
            setIsPopupVisible(true);
            return;
        }

        if (!isPaused) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLeft, isPaused]);

    useEffect(() => {
        if (isPopupVisible) {
            playerRef.current?.pauseVideo();
        }
    }, [isPopupVisible]);

    const onPlayerError = (event) => {
        handlePlayerError(event);
    };

    const loadNewVideo = (list) => {
        setVideoError(false);
        if (!list || list.length === 0) {
            console.warn("Video list is empty or null");
            return;
        }
        const video = list[Math.floor(Math.random() * list.length)];
        setCurrentVideo(video);
        setTimeLeft(CONFIG.timerDuration);
        setIsPaused(false);
        console.log("Loading new video:", video);
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
            setHearts((prev) => Math.max(prev - 0.5, 0));
        } else {
            setMessage(`uh oh, not right. The answer 
            is ${actualYear}.`);
            setHearts((prev) => Math.max(prev - 1, 0));
        }

        setGuesses((prev) => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
    };

    const handleSkip = () => {
        if (hearts <= 0) return;
        playerRef.current?.pauseVideo();
        setGuesses((prev) => [...prev, { guess: 'Skipped', points: -1 }]);
        setHearts((prev) => Math.max(prev - 1, 0));
        setMessage("Omg!");
        setIsPopupVisible(true);
        setSkipped(true);
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
        if (skipped) {
            setSkipped(false);
            loadNewVideo(videoList);
        } else if (hearts > 0 && timeLeft > 0) {
            loadNewVideo(videoList);
        }
    };

    const handleNextRound = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (hearts > 0 && timeLeft > 0) {
            console.log("handleNextRound called with videoList:", videoList);
            loadNewVideo(videoList);
        } else {
            console.log("handleNextRound not called because hearts or timeLeft is zero");
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
                    {currentVideo ? (
                        <VideoPlayer
                            video={currentVideo}
                            onStateChange={setIsPaused}
                            onError={onPlayerError}
                            ref={playerRef}
                        />
                    ) : (
                        <div>Video Unavailable</div>
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