import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameOfLife from './game-of-life/GameOfLife';
import Epidemic from './epidemic/Epidemic';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/game-of-life" element={<GameOfLife />} />
                <Route path="/epidemic" element={<Epidemic />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

reportWebVitals();
