import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GameOfLife.css';

const GameOfLife = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [gridWidth, setGridWidth] = useState(10);
    const [gridHeight, setGridHeight] = useState(10);
    const [isMusicOn, setIsMusicOn] = useState(false);  // État pour gérer la musique

    const createInitialGrid = (width, height) => {
        const initialGrid = Array(height).fill().map(() => Array(width).fill(0));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                initialGrid[i][j] = Math.random() > 0.7 ? 1 : 0;
            }
        }
        return initialGrid;
    };

    const [grid, setGrid] = useState(() => createInitialGrid(gridWidth, gridHeight));

    const applyGameOfLifeRules = (currentGrid) => {
        const newGrid = currentGrid.map((row, i) => {
            return row.map((cell, j) => {
                const neighbors = [
                    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
                ];
                let liveNeighbors = 0;

                neighbors.forEach(([dx, dy]) => {
                    const ni = i + dx;
                    const nj = j + dy;
                    if (ni >= 0 && ni < gridHeight && nj >= 0 && nj < gridWidth) {
                        liveNeighbors += currentGrid[ni][nj];
                    }
                });

                if (cell === 1) {
                    return liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
                } else {
                    return liveNeighbors === 3 ? 1 : 0;
                }
            });
        });
        return newGrid;
    };

    const stepForward = () => {
        setGrid(prevGrid => applyGameOfLifeRules(prevGrid));
    };

    const toggleSimulation = () => {
        setIsSimulating(!isSimulating);
    };

    const resetGrid = () => {
        setGrid(createInitialGrid(gridWidth, gridHeight));
    };

    const updateCell = (rowIndex, colIndex) => {
        setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[rowIndex] = [...newGrid[rowIndex]];
            newGrid[rowIndex][colIndex] = newGrid[rowIndex][colIndex] === 1 ? 0 : 1;
            return newGrid;
        });
    };

    // Effet pour gérer la musique en boucle
    useEffect(() => {
        const audio = new Audio(process.env.PUBLIC_URL + '/Mingle_Song_Squid_Game_Round_And_Round-653466.mp3'); // Chemin vers votre fichier audio

        if (isMusicOn) {
            audio.loop = true;  // Activer la boucle
            audio.play();
        } else {
            audio.pause();
        }

        return () => {
            audio.pause(); // S'assurer que l'audio s'arrête quand le composant est démonté ou que le son est désactivé
        };
    }, [isMusicOn]);

    useEffect(() => {
        setGrid(createInitialGrid(gridWidth, gridHeight));
    }, [gridWidth, gridHeight]);

    useEffect(() => {
        if (isSimulating) {
            const interval = setInterval(() => {
                stepForward();
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isSimulating]);

    return (
        <div className="game-of-life">
            <h1>Jeu de la Vie</h1>

            <div className="grid-size-controls">
                <label>
                    Largeur:
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={gridWidth}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 5;
                            setGridWidth(value < 5 ? 5 : value);
                        }}
                    />
                </label>
                <label>
                    Hauteur:
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={gridHeight}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 5;
                            setGridHeight(value < 5 ? 5 : value);
                        }}
                    />
                </label>
            </div>


            <div className="grid-container2">
                <div
                    className="grid2"
                    style={{
                        gridTemplateColumns: `repeat(${gridWidth}, 30px)`,
                        gridTemplateRows: `repeat(${gridHeight}, 30px)`,
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`cell2 ${cell === 1 ? 'alive' : 'dead'}`}
                                onClick={() => updateCell(rowIndex, colIndex)}
                            ></div>
                        ))
                    )}
                </div>
            </div>

            <div className="buttons">
                <Link to="/">
                    <button>Retour</button>
                </Link>

                <button onClick={stepForward}>Step</button>
                <button
                    onClick={toggleSimulation}
                    className={isSimulating ? 'stop' : 'simulate'}
                >
                    {isSimulating ? 'Stop' : 'Simuler'}
                </button>
                {/* Bouton pour activer/désactiver la musique */}
                <button
                    onClick={() => setIsMusicOn(!isMusicOn)}
                    className={isMusicOn ? 'stop' : 'simulate'}
                >
                    {isMusicOn ? 'Musique Off' : 'Musique On'}
                </button>
                <button onClick={resetGrid}>Réinitialiser</button>
                <Link to="/epidemic">
                    <button>Accéder au Jeu de l'épidemie</button>
                </Link>

            </div>
        </div>
    );
};

export default GameOfLife;
