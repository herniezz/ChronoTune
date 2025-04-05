import React from 'react';
import styled from 'styled-components';

const PopUpCard = ({ message, onClose }) => {
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
        font-family: Montserrat, sans-serif;
        width: 600px;
        height: 500px;
        translate: -6px -6px;
        background: #583292;
        border: 3px solid #000000;
        box-shadow: 12px 12px 0 #000000;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .head {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        font-weight: 900;
        width: 100%;
        height: 32px;
        background: #ffffff;
        padding: 5px 12px;
        color: #070707;
        border-bottom: 3px solid #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
    }

    .content {
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 600;
    }
`;

export default PopUpCard;