// src/components/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import GameForm from './GameForm';
import PopUpCard from './PopUpCard';
import Hearts from './Hearts';
import GameOverPopup from './GameOverPopup';
import { VideoErrorProvider, useVideoError } from '../utils/errorHandlers';
import { addHighscore } from '../utils/highscores';
import { CONFIG } from '../config';
import '../App.css';

function GameScreen({ category, onBack }) {
    return (
        <VideoErrorProvider>
            <GameScreenContent category={category} onBack={onBack} />
        </VideoErrorProvider>
    );
}

function GameScreenContent({ category, onBack }) {
    const [videoList, setVideoList] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [hearts, setHearts] = useState(5);
    const [message, setMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const playerRef = useRef(null);
    const { setVideoError, handlePlayerError } = useVideoError();
    const [startTime, setStartTime] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);


    const loadNewVideo = (list) => {
        setVideoError(false);
        if (!list || list.length === 0) {
            console.warn("Video list is empty or null");
            return;
        }
        const video = list[Math.floor(Math.random() * list.length)];
        setCurrentVideo(video);
        setIsPaused(false);
        setStartTime(null);
    };

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
                playlistFile = 'dadrock';
                break;
            case 'sassy':
                playlistFile = 'sassy';
                break;
            case 'hiphop':
                playlistFile = 'hiphop';
                break;
            case 'metal':
                playlistFile = 'metal';
                break;
            case 'numetal':
                playlistFile = 'numetal';
                break;
            default:
                playlistFile = 'top_teledyski';
        }

        const basePath = process.env.PUBLIC_URL || '';
        fetch(`${basePath}/playlist/${playlistFile}.json`)
            .then((res) => res.json())
            .then((data) => {
                setVideoList(data);
                console.log("Playlist loaded:", data);
                loadNewVideo(data);
            })
            .catch((err) => console.error("Error loading playlist:", err));
    }, [category]);

    useEffect(() => {
        if (isPopupVisible) {
            playerRef.current?.pauseVideo();
        }
    }, [isPopupVisible]);

    useEffect(() => {
        if (hearts <= 0 && !isPopupVisible && !isGameOver) {
            setIsGameOver(true);
        }
    }, [hearts, isPopupVisible, isGameOver]);

    const onPlayerError = (event) => {
        handlePlayerError(event);
    };

    const handleVideoEnd = () => {
        if (playerRef.current && startTime !== null) {
            playerRef.current.seekTo(startTime);
            playerRef.current.playVideo();
        }
    };

    const handleVideoReady = () => {
        setIsPlayerReady(true);
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            setStartTime(currentTime);
        }
    };

    const handleSubmit = (guess) => {
        if (!currentVideo || hearts <= 0) return;
        const guessedYear = parseInt(guess, 10);

        const actualYear = currentVideo.year;
        const songTitle = currentVideo.title || "Unknown Song";
        let points = 0;

        if (guessedYear === actualYear) {
            points = 1;
            setMessage(`Nice, you did it! "${songTitle}" was released in ${actualYear}.`);
        } else if (Math.abs(guessedYear - actualYear) <= 2) {
            points = 1;
            setMessage(`Great guess! "${songTitle}" was released in ${actualYear}. You get a full point for being within 2 years!`);
        } else if (Math.abs(guessedYear - actualYear) <= 3) {
            points = 0.5;
            setMessage(`Close enough! "${songTitle}" was released in ${actualYear}. You get half a point for being within 3 years.`);
        } else {
            setMessage(`Not quite right. "${songTitle}" was released in ${actualYear}.`);
            setHearts((prev) => Math.max(prev - 1, 0));
        }

        setGuesses((prev) => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
    };

    const handleReset = () => {
        setGuesses([]);
        setHearts(5);
        setMessage('');
        setIsPopupVisible(false);
        setIsGameOver(false);
        if (videoList && videoList.length > 0) {
            loadNewVideo(videoList);
        }
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (videoList && videoList.length > 0) {
            loadNewVideo(videoList);
        }
    };

    const handleNextRound = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (videoList && videoList.length > 0) {
            loadNewVideo(videoList);
        }
    };

    const handleSubmitScore = (nickname) => {
        const totalPoints = guesses.reduce(
            (acc, curr) => (curr.points > 0 ? acc + curr.points : acc),
            0
        );
        
        addHighscore(nickname, totalPoints, category);
    };

    const handleGameRestart = () => {
        handleReset();
    };

    const totalPoints = guesses.reduce(
        (acc, curr) => (curr.points > 0 ? acc + curr.points : acc),
        0
    );

    const getCategoryDisplayName = (cat) => {
        const categoryNames = {
            'polish': 'Polish Hits',
            'dadrock': 'Dad Rock',
            'president': 'Presidential',
            'sassy': 'Sassy',
            'hiphop': 'Hip Hop'
        };
        return categoryNames[cat] || cat;
    };

    return (
        <>
            {/* input form with info section */}
            <div className="input-container">
                <div className="info-section">
                    <div id="score-board">Points: <span>{totalPoints}</span></div>
                    <Hearts count={hearts} />
                </div>
                <GameForm key={currentVideo?.id} onSubmit={handleSubmit} />
            </div>

            <div className="player-area-container">
                {/* YouTube player */}
                <div id="player">
                    {currentVideo ? (
                        <VideoPlayer
                            video={currentVideo}
                            onStateChange={setIsPaused}
                            onError={onPlayerError}
                            onEnd={handleVideoEnd}
                            onReady={handleVideoReady}
                            ref={playerRef}
                        />
                    ) : (
                        <div>Video Unavailable</div>
                    )}
                </div>
            </div>

            {/* Back to menu button */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="home-button" onClick={onBack}>
                    ← Back to Menu
                </button>
            </div>

            {isPopupVisible && (
                <PopUpCard
                    message={message}
                    onClose={handleClosePopup}
                    onNextRound={handleNextRound}
                />
            )}

            {isGameOver && (
                <GameOverPopup
                    onClose={handleClosePopup}
                    onSubmitScore={handleSubmitScore}
                    onRestart={handleGameRestart}
                    totalPoints={totalPoints}
                    category={getCategoryDisplayName(category)}
                />
            )}
        </>
    );
}

export default GameScreen;