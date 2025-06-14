import React, { useState, useEffect } from 'react';
import { getTopScores, getTopScoresByCategory, clearHighscores } from '../utils/highscores';

const HighscoresScreen = ({ onBack }) => {
    const [scores, setScores] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'polish', label: 'Polish Hits' },
        { value: 'dadrock', label: 'Dad Rock' },
        { value: 'president', label: 'Presidential' },
        { value: 'sassy', label: 'Sassy' },
        { value: 'hiphop', label: 'Hip Hop' },
        { value: 'metal', label: 'Metal' },
        { value: 'numetal', label: 'Nu Metal' }
    ];

    useEffect(() => {
        loadScores();
    }, [selectedCategory]);

    const loadScores = () => {
        if (selectedCategory === 'all') {
            setScores(getTopScores(20));
        } else {
            setScores(getTopScoresByCategory(selectedCategory, 20));
        }
    };

    const handleClearScores = () => {
        if (clearHighscores()) {
            setScores([]);
            setShowClearConfirm(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getCategoryDisplayName = (category) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : category;
    };

    return (
        <div className="highscores-container">
            <div className="highscores-header">
                <h1 className="highscores-title">High Scores</h1>
                <button className="back-button" onClick={onBack}>
                    ← Back to Menu
                </button>
            </div>

            <div className="category-filter">
                <label htmlFor="category-select">Filter by category:</label>
                <select 
                    id="category-select"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="scores-list">
                {scores.length === 0 ? (
                    <div className="no-scores">
                        <p>No high scores yet!</p>
                        <p>Play some games to see your scores here.</p>
                    </div>
                ) : (
                    <div className="scores-table">
                        <div className="table-header">
                            <div className="rank-col">Rank</div>
                            <div className="name-col">Nickname</div>
                            <div className="score-col">Score</div>
                            <div className="category-col">Category</div>
                            <div className="date-col">Date</div>
                        </div>
                        {scores.map((score, index) => (
                            <div key={score.id} className="score-row">
                                <div className="rank-col">#{index + 1}</div>
                                <div className="name-col">{score.nickname}</div>
                                <div className="score-col">{score.points}</div>
                                <div className="category-col">{getCategoryDisplayName(score.category)}</div>
                                <div className="date-col">{formatDate(score.date)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="actions">
                <button 
                    className="clear-button" 
                    onClick={() => setShowClearConfirm(true)}
                    disabled={scores.length === 0}
                >
                    Clear All Scores
                </button>
            </div>

            {showClearConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-dialog">
                        <h3>Clear All High Scores?</h3>
                        <p>This action cannot be undone!</p>
                        <div className="confirm-buttons">
                            <button className="confirm-yes" onClick={handleClearScores}>
                                Yes, Clear All
                            </button>
                            <button className="confirm-no" onClick={() => setShowClearConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HighscoresScreen; 