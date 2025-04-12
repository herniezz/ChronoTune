import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StartScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-color: #000;
  color: white;
  padding: var(--spacing-md);
`;

const Title = styled.h1`
  font-size: 4rem;
  font-family: 'Press Start 2P', monospace;
  margin-bottom: var(--spacing-lg);
  color: white;
  text-transform: lowercase;
  letter-spacing: 2px;
`;

const Description = styled.p`
  font-size: 1rem;
  max-width: 500px;
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
`;

const GitHubLink = styled.a`
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: white;
  font-size: 2rem;
  text-decoration: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StartScreen = () => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/game');
    };

    return (
        <StartScreenContainer>
            <Title>chronotune</Title>
            <Description>
                Can you beat the clock? Test your music 
                memory by guessing the release years of
                iconic music videos.
            </Description>
            <ButtonsContainer>
                <button 
                    className="button button-start"
                    onClick={handleStartGame}
                >
                    Start game
                </button>
                <button 
                    className="button button-start"
                    onClick={() => alert('Highscores coming soon!')}
                >
                    Highscores
                </button>
            </ButtonsContainer>
            <GitHubLink href="https://github.com/herniezz/ChronoTune" target="_blank" rel="noopener noreferrer">
                ⌾
            </GitHubLink>
        </StartScreenContainer>
    );
}

export default StartScreen; 