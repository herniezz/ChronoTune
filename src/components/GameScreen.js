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

const FACTS_PATH = `${process.env.PUBLIC_URL || ''}/funfactsforloading/music_cognition_fun_facts.json`;
const GIFS = [
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/capy1.gif`,
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/dog3.gif`,
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/dog4.gif`,
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/dog5.gif`,
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/cat2.gif`,
    `${process.env.PUBLIC_URL || ''}/funfactsforloading/cat6.gif`,
];

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
    const [isLoading, setIsLoading] = useState(true);
    const [facts, setFacts] = useState([]);
    const [randomFact, setRandomFact] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [randomGif, setRandomGif] = useState(GIFS[0]);
    const FALLBACK_GIF = 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif';
    const [gifError, setGifError] = useState(false);

    useEffect(() => {
        console.log('Loading facts from:', FACTS_PATH);
        fetch(FACTS_PATH)
            .then(res => {
                console.log('Facts response status:', res.status);
                return res.json();
            })
            .then(data => {
                console.log('Facts loaded:', data.length, 'facts');
                console.log('Sample fact:', data[0]);
                setFacts(data);
                if (data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    console.log('Selected random fact index:', randomIndex);
                    console.log('Selected random fact:', data[randomIndex]);
                    setRandomFact(data[randomIndex]);
                }
            })
            .catch(err => {
                console.error('Error loading facts:', err);
                setFacts([]);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setIsPlayerReady(false);
        setGifError(false);
        if (facts.length > 0) {
            const randomIndex = Math.floor(Math.random() * facts.length);
            const newFact = facts[randomIndex];
            console.log('Setting new random fact index:', randomIndex);
            console.log('Setting new random fact:', newFact);
            console.log('Citation:', newFact.citation);
            console.log('Link:', newFact.link);
            setRandomFact(newFact);
        }
        const newGif = GIFS[Math.floor(Math.random() * GIFS.length)];
        console.log('Setting new random gif:', newGif);
        setRandomGif(newGif);
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
                try {
                    if (playerRef.current && typeof playerRef.current.unMute === 'function') {
                        playerRef.current.unMute();
                    }
                } catch (e) {
                    console.error('Unmute error:', e);
                }
            }, 100);
        }, 7000);
        return () => clearTimeout(timer);
    }, [currentVideo, facts]);

    useEffect(() => {
        if (isLoading && isPlayerReady) {
            try {
                if (playerRef.current && typeof playerRef.current.mute === 'function') {
                    playerRef.current.mute();
                }
            } catch (e) {
                console.error('Mute error:', e);
            }
        }
    }, [isLoading, isPlayerReady]);

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
        if (isLoading) {
            try {
                if (playerRef.current && typeof playerRef.current.mute === 'function') playerRef.current.mute();
            } catch (e) {
                console.error('Mute error (onReady):', e);
            }
        }
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
            {/* Global loading overlay - retro two-column style */}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    fontFamily: "'Press Start 2P', monospace",
                    opacity: isLoading ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}>
                    {randomFact ? (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            gap: 48,
                            opacity: isLoading ? 1 : 0,
                            transform: isLoading ? 'scale(1)' : 'scale(0.95)',
                            transition: 'all 0.5s ease-in-out'
                        }}>
                            {/* Left: gif */}
                            <img
                                src={gifError ? FALLBACK_GIF : randomGif}
                                alt="fun gif"
                                style={{ 
                                    width: 600, 
                                    height: 450, 
                                    objectFit: 'cover', 
                                    borderRadius: 8, 
                                    background: '#222', 
                                    boxShadow: '0 0 0 4px #fff',
                                    imageRendering: 'pixelated'
                                }}
                                onError={() => setGifError(true)}
                            />
                            {/* Right: fact */}
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'flex-start', 
                                maxWidth: 500 
                            }}>
                                <div style={{ 
                                    fontSize: 40, 
                                    color: '#fff', 
                                    marginBottom: 24, 
                                    lineHeight: 1.1, 
                                    fontWeight: 'bold', 
                                    letterSpacing: 2,
                                    textShadow: '2px 2px 0 #000'
                                }}>
                                    Did you<br/>know..
                                </div>
                                <div style={{ 
                                    fontSize: 22, 
                                    color: '#fff', 
                                    marginBottom: 24, 
                                    fontWeight: 'bold', 
                                    lineHeight: 1.2,
                                    textShadow: '2px 2px 0 #000'
                                }}>
                                    {randomFact.title.replace('Did you know…', '').replace('Did you know...', '').replace('Did you know', '')}
                                </div>
                                <div style={{ 
                                    background: '#fff', 
                                    color: '#111', 
                                    fontSize: 18, 
                                    padding: '18px 24px', 
                                    borderRadius: 4, 
                                    marginBottom: 24, 
                                    fontWeight: 'bold', 
                                    boxShadow: '0 0 0 4px #fff', 
                                    fontFamily: "'Press Start 2P', monospace",
                                    imageRendering: 'pixelated'
                                }}>
                                    {randomFact.content}
                                </div>
                                {/* Citation under the fact content */}
                                {randomFact.title_names && (
                                    <span
                                        style={{
                                            fontStyle: 'italic',
                                            fontSize: 18,
                                            color: '#fff',
                                            opacity: 0.8,
                                            marginTop: 8,
                                            textShadow: '2px 2px 0 #000'
                                        }}
                                    >
                                        {randomFact.title_names}
                                    </span>
                                )}
                                {/* Loading bar */}
                                {isLoading && (
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: '#333',
                                        marginTop: '16px',
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                        boxShadow: 'inset 0 0 0 2px #000',
                                        imageRendering: 'pixelated'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            background: '#fff',
                                            animation: 'loading 7s linear forwards',
                                            transformOrigin: 'left',
                                            boxShadow: '0 0 0 2px #000',
                                            imageRendering: 'pixelated'
                                        }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            color: '#fff',
                            fontSize: 32
                        }}>
                            Loading fun facts...
                        </div>
                    )}
                </div>
            )}

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

// Update the keyframes
const loadingKeyframes = `
@keyframes loading {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}

@keyframes pixelate {
    0% {
        filter: blur(0);
    }
    50% {
        filter: blur(1px);
    }
    100% {
        filter: blur(0);
    }
}
`;

// Add the keyframes to the document
const style = document.createElement('style');
style.textContent = loadingKeyframes;
document.head.appendChild(style);