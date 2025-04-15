// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import './App.css';

function App() {
    return (
        <BrowserRouter basename="/ChronoTune">
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/game" element={<GameScreen />} />
                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
