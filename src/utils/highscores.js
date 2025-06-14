// Highscore utility functions
export const getHighscores = () => {
    try {
        const scores = localStorage.getItem('chronotune-highscores');
        return scores ? JSON.parse(scores) : [];
    } catch (error) {
        console.error('Error loading highscores:', error);
        return [];
    }
};

export const addHighscore = (nickname, points, category) => {
    try {
        const scores = getHighscores();
        const newScore = {
            id: Date.now(),
            nickname: nickname.trim(),
            points: points,
            category: category,
            date: new Date().toISOString()
        };
        
        scores.push(newScore);
        
        // Sort by points (highest first), then by date (most recent first)
        scores.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return new Date(b.date) - new Date(a.date);
        });
        
        // Keep only top 50 scores to prevent localStorage from getting too large
        const topScores = scores.slice(0, 50);
        
        localStorage.setItem('chronotune-highscores', JSON.stringify(topScores));
        return true;
    } catch (error) {
        console.error('Error saving highscore:', error);
        return false;
    }
};

export const getTopScores = (limit = 10) => {
    const scores = getHighscores();
    return scores.slice(0, limit);
};

export const getTopScoresByCategory = (category, limit = 10) => {
    const scores = getHighscores();
    return scores
        .filter(score => score.category === category)
        .slice(0, limit);
};

export const clearHighscores = () => {
    try {
        localStorage.removeItem('chronotune-highscores');
        return true;
    } catch (error) {
        console.error('Error clearing highscores:', error);
        return false;
    }
}; 