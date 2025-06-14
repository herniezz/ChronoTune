import React, { useState } from 'react';
import styled from 'styled-components';

const GameOverPopup = ({ points, category, onSubmitScore, onRestart }) => {
    const [nickname, setNickname] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim().length > 0) {
            onSubmitScore(nickname.trim());
            setIsSubmitted(true);
        }
    };

    const handleRestart = () => {
        onRestart();
    };

    return (
        <StyledWrapper>
            <div className="backdrop"></div>
            <div className="card">
                <div className="head">
                    GAME OVER
                </div>
                <div className="content">
                    <div className="score-info">
                        <div className="final-score">Final Score: {points}</div>
                        <div className="category">Category: {category}</div>
                    </div>
                    
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="nickname-form">
                            <div className="form-text">Enter your nickname for the highscore:</div>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Your nickname"
                                maxLength={20}
                                className="nickname-input"
                                autoFocus
                            />
                            <div className="button-container">
                                <button type="submit" className="submit-button" disabled={!nickname.trim()}>
                                    Save Score
                                </button>
                                <button type="button" onClick={handleRestart} className="restart-button">
                                    Skip & Restart
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="submitted">
                            <div className="success-message">Score saved successfully!</div>
                            <div className="button-container">
                                <button onClick={handleRestart} className="restart-button">
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
    }

    .card {
        font-family: 'Press Start 2P', sans-serif;
        width: 400px;
        min-height: 350px;
        background: var(--azure-web);
        border: 3px solid var(--super-dark);
        box-shadow: 8px 8px 0 var(--super-dark);
        overflow: hidden;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        color: var(--super-dark);
        border-radius: 4px;
    }

    .head {
        font-size: 16px;
        font-weight: 900;
        width: 100%;
        height: 40px;
        background: var(--super-dark);
        color: var(--azure-web);
        padding: 8px 16px;
        border-bottom: 3px solid var(--super-dark);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        padding: 20px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .score-info {
        text-align: center;
        line-height: 1.8;
    }

    .final-score {
        font-size: 14px;
        margin-bottom: 8px;
    }

    .category {
        font-size: 10px;
        text-transform: uppercase;
    }

    .nickname-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-text {
        text-align: center;
        line-height: 1.5;
    }

    .nickname-input {
        padding: 12px;
        font-size: 12px;
        font-family: 'Press Start 2P', sans-serif;
        background: white;
        border: 2px solid var(--super-dark);
        color: var(--super-dark);
        text-align: center;
        outline: none;
    }

    .nickname-input:focus {
        border-color: var(--highlight-color);
        box-shadow: 0 0 0 2px rgba(73, 115, 255, 0.3);
    }

    .button-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
    }

    .submit-button, .restart-button {
        padding: 12px 20px;
        font-size: 10px;
        font-family: 'Press Start 2P', sans-serif;
        border: 2px solid var(--super-dark);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }

    .submit-button {
        background: var(--super-dark);
        color: var(--azure-web);
    }

    .submit-button:hover:not(:disabled) {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 var(--super-dark);
    }

    .submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .restart-button {
        background: var(--azure-web);
        color: var(--super-dark);
    }

    .restart-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 var(--super-dark);
    }

    .submitted {
        text-align: center;
    }

    .success-message {
        color: green;
        margin-bottom: 20px;
        line-height: 1.5;
    }
`;

export default GameOverPopup; 