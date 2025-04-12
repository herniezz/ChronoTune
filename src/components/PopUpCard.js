import React, { useEffect } from 'react';
import styled from 'styled-components';

const PopUpCard = ({ message, onClose, onNextRound }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                onNextRound();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onNextRound]);

    return (
        <StyledWrapper>
            <div className="backdrop" onClick={onClose}></div>
            <div className="card">
                <div className="head">
                    UWAGA
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <div className="message-text">{message}</div>
                    <div className="button-container">
                        <button className="next-round-button" onClick={onNextRound}>Next Round</button>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .card {
        font-family: 'Press Start 2P', sans-serif;
        width: 320px;
        height: 280px;
        translate: -4px -4px;
        background: var(--azure-web);
        border: 3px solid var(--super-dark);
        box-shadow: 8px 8px 0 var(--super-dark);
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        color: var(--super-dark);
        border-radius: 4px;
    }

    .head {
        font-family: 'Press Start 2P', sans-serif;
        font-size: 14px;
        font-weight: 900;
        width: 100%;
        height: 32px;
        background: var(--azure-web);
        padding: 5px 12px;
        color: var(--super-dark);
        border-bottom: 3px solid var(--super-dark);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: var(--super-dark);
        font-family: 'Press Start 2P', sans-serif;
        padding: 30px;
    }

    .content {
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 600;
        color: var(--super-dark);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 32px);
    }

    .message-text {
        margin-top: 16px;
        line-height: 1.5;

    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 60px;
    }

    .next-round-button {
        padding: 10px 20px;
        font-size: 12px;
        cursor: pointer;
        background-color: var(--super-dark);
        color: var(--azure-web);
        border: none;
        font-family: 'Press Start 2P', sans-serif;
        width: 75%;
        text-align: center;
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .next-round-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 var(--super-dark);
        background-color: var(--super-dark);
    }
`;

export default PopUpCard;