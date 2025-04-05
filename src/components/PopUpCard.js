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
                    {message}
                    <button className="next-round-button" onClick={onNextRound}>Next Round</button>
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
        width: 400px;
        height: 400px;
        translate: -6px -6px;
        background: #ffffff;
        border: 3px solid #000000;
        box-shadow: 12px 12px 0 #000000;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        color: #000000;
    }

    .head {
        font-family: 'Press Start 2P', sans-serif;
        font-size: 14px;
        font-weight: 900;
        width: 100%;
        height: 32px;
        background: #ffffff;
        padding: 5px 12px;
        color: #000000;
        border-bottom: 3px solid #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 36px;
        cursor: pointer;
        color: #000000;
        font-family: 'Press Start 2P', sans-serif;
    }

    .content {
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
    }

    .next-round-button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        background-color: #000000;
        color: #ffffff;
        border: none;
        font-family: 'Press Start 2P', sans-serif;
    }
`;

export default PopUpCard;