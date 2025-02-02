import React, { useState, useEffect, useRef } from 'react';
import './Epidemic.css';
import { Link } from "react-router-dom";

const Epidemic = () => {
    const [population, setPopulation] = useState(() => initializePopulation(1000));
    const [isSimulating, setIsSimulating] = useState(false);
    const [p1, setP1] = useState(0.5);
    const [p2, setP2] = useState(0.5);
    const [isMusicOn, setIsMusicOn] = useState(false);
    const audioRef = useRef(null);

    const gridSize = 30; // Taille de la grille (30x30)

    function initializePopulation(size) {
        let initial = Array(size).fill('Sain');
        initial[0] = 'Malade'; // On place une personne malade au départ
        for (let i = 1; i < size * 0.3; i++) {
            initial[i] = 'Immunisé'; // 30% de la population est immunisée
        }

        // Mélange aléatoire de la population
        for (let i = initial.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initial[i], initial[j]] = [initial[j], initial[i]]; // Échange les éléments
        }

        return initial;
    }


    function getNeighbors(index) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const neighbors = [];

        // Voisins : haut, bas, gauche, droite et 4 diagonales
        if (row > 0) neighbors.push(index - gridSize); // haut
        if (row < gridSize - 1) neighbors.push(index + gridSize); // bas
        if (col > 0) neighbors.push(index - 1); // gauche
        if (col < gridSize - 1) neighbors.push(index + 1); // droite
        if (row > 0 && col > 0) neighbors.push(index - gridSize - 1); // haut-gauche
        if (row > 0 && col < gridSize - 1) neighbors.push(index - gridSize + 1); // haut-droite
        if (row < gridSize - 1 && col > 0) neighbors.push(index + gridSize - 1); // bas-gauche
        if (row < gridSize - 1 && col < gridSize - 1) neighbors.push(index + gridSize + 1); // bas-droite

        return neighbors;
    }

    function stepSimulation() {
        setPopulation(prev => prev.map((cell, index, arr) => {
            if (cell === 'Mort' || cell === 'Immunisé') return cell;
            if (cell === 'Malade') return Math.random() < p1 ? 'Mort' : 'Immunisé';
            if (cell === 'Sain') {
                const neighbors = getNeighbors(index).map(i => arr[i]);
                const hasSickNeighbor = neighbors.includes('Malade');
                return hasSickNeighbor && Math.random() < p2 ? 'Malade' : 'Sain';
            }
            return cell;
        }));
    }

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(process.env.PUBLIC_URL + '/Mingle_Song_Squid_Game_Round_And_Round-653466.mp3');
            audioRef.current.loop = true;
        }

        if (isMusicOn) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isMusicOn]);

    useEffect(() => {
        if (isSimulating) {
            const interval = setInterval(stepSimulation, 500);
            return () => clearInterval(interval);
        }
    }, [isSimulating]);

    return (
        <div className="epidemic-container">
            <h1>Simulation d'Épidémie</h1>
            <div className="controls">
                <label>
                    p1 (Taux de mortalité):
                    <input type="number" min="0" max="1" step="0.01" value={p1}
                           onChange={(e) => setP1(Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)))}/>
                </label>
                <label>
                    p2 (Probabilité d'infection):
                    <input type="number" min="0" max="1" step="0.01" value={p2}
                           onChange={(e) => setP2(Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)))}/>
                </label>
            </div>
            <div className="grid3">
                {population.map((state, index) => (
                    <div key={index} className={`cell3 ${state.toLowerCase()}`}></div>
                ))}
            </div>

            {/* Légende avec le nombre d'individus */}
            <div className="legend">
                <div className="legend-item">
                    <div className="cell3 sain"></div>
                    <span>Sain ({population.filter(cell => cell === 'Sain').length})</span>
                </div>
                <div className="legend-item">
                    <div className="cell3 malade"></div>
                    <span>Malade ({population.filter(cell => cell === 'Malade').length})</span>
                </div>
                <div className="legend-item">
                    <div className="cell3 immunisé"></div>
                    <span>Immunisé ({population.filter(cell => cell === 'Immunisé').length})</span>
                </div>
                <div className="legend-item">
                    <div className="cell3 mort"></div>
                    <span>Mort ({population.filter(cell => cell === 'Mort').length})</span>
                </div>
            </div>

            <div className="buttons">
                <Link to="/game-of-life">
                    <button>Retour</button>
                </Link>
                <button onClick={stepSimulation}>Step</button>
                <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={isSimulating ? 'stop' : 'simulate'}
                >
                    {isSimulating ? 'Stop' : 'Simuler'}
                </button>
                <button
                    onClick={() => setIsMusicOn(!isMusicOn)}
                    className={isMusicOn ? 'stop' : 'simulate'}
                >
                    {isMusicOn ? 'Musique Off' : 'Musique On'}
                </button>
                <button onClick={() => setPopulation(initializePopulation(1000))}>Réinitialiser</button>
            </div>
        </div>
    );

};

export default Epidemic;
