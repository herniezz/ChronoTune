import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import GameForm from './GameForm';
import PopUpCard from './PopUpCard';
import Hearts from './Hearts';
import { CONFIG } from '../config'; // Adjusted path
import '../App.css'; // Adjusted path

function GameScreen() { // Renamed function
    const [videoList, setVideoList] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(CONFIG.timerDuration);
    const [hearts, setHearts] = useState(5);
    const [message, setMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const videoRef = useRef(null);

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

        if (isNaN(guessedYear) || guessedYear < 1900 || guessedYear > 2100) {
            setMessage("Please enter a valid year between 1900 and 2100.");
            setIsPopupVisible(true);
            return;
        }

        const actualYear = currentVideo.year;
        let points = 0;

        if (guessedYear === actualYear) {
            points = 1;
            setMessage("JAPIDI . gratulacje");
        } else if (Math.abs(guessedYear - actualYear) <= 5) {
            points = 0.5;
            setMessage(`masz tu 0.5 zeby ci smutno nie bylo. rok to ${actualYear}.`);
            setHearts(prev => Math.max(prev - 0.5, 0)); // Reduce hearts by 0.5 for close guesses
        } else {
            setMessage(`SKIBIDI ALE DEBIL XD rok to ${actualYear}.`);
            setHearts(prev => Math.max(prev - 1, 0)); // Reduce hearts by 1 for wrong guesses
        }

        setGuesses(prev => [...prev, { guess: guessedYear, points }]);
        setIsPopupVisible(true);
    };

    const handleSkip = () => {
        if (hearts <= 0) return;
        setGuesses(prev => [...prev, { guess: 'Skipped', points: -1 }]);
        setHearts(prev => Math.max(prev - 1, 0)); // Reduce hearts by 1 for each skip
        setMessage("pominiety utwor, tracisz 1 punkt");
        setIsPopupVisible(true);
    };

    const handleReset = () => {
        setGuesses([]);
        setHearts(5);
        setMessage('');
        // Optionally reload video on reset or just clear score
        // loadNewVideo(videoList); 
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setMessage('');
        if (hearts > 0 && timeLeft > 0) { // Only load new video if game is still active
           loadNewVideo(videoList);
        }
    };

    const handleNextRound = () => {
        setIsPopupVisible(false);
        setMessage('');
         if (hearts > 0 && timeLeft > 0) { // Only load new video if game is still active
           loadNewVideo(videoList);
        }
    };

    const totalPoints = guesses.reduce((acc, curr) => curr.points > 0 ? acc + curr.points : acc, 0);

    useEffect(() => {
        if (hearts <= 0 && !isPopupVisible) {
            setMessage("kliknij se zeby zaczac od nowa");
            setIsPopupVisible(true);
        }
    }, [hearts, isPopupVisible]);

    return (
        // Removed the outer <div className="App"> as this will be handled by the router layout
        <>
            <h1>Guess the Release Year</h1>
            <div className="input-container">
                <GameForm onSubmit={handleSubmit} />
            </div>

            <div className="player-area-container">
                <button className="button button-skip" onClick={handleSkip}>Skip</button>
                <div id="player">
                    <VideoPlayer video={currentVideo} ref={videoRef} />
                </div>
                <button className="button button-reset" onClick={handleReset}>Reset</button>
            </div>

            <div className="centered-info">
                <div id="score-board">Points: <span>{totalPoints}</span></div>
                <div id="timer-display">Time left: {timeLeft}s</div>
                <Hearts count={hearts} />
            </div>
            {isPopupVisible && <PopUpCard message={message} onClose={handleClosePopup} onNextRound={handleNextRound} />}
        </>
    );
}

export default GameScreen; // Renamed export 