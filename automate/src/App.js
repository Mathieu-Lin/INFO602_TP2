import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  // État initial : une grille de 99 cellules avec une cellule initiale à 1 au centre
  const [cells, setCells] = useState(() => {
    let initial = Array(99).fill(0);
    initial[49] = 1; // Cellule centrale à 1
    return initial;
  });

  // État pour la saisie de la valeur initiale
  const [initialValue, setInitialValue] = useState(49); // Par défaut, la cellule centrale (49)

  // État pour savoir si la simulation est en cours
  const [isSimulating, setIsSimulating] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);  // État pour gérer la musique

  // Fonction qui applique la règle de transition à la grille
  const applyRule = (currentCells) => {
    let newCells = [...currentCells];
    for (let i = 1; i < currentCells.length - 1; i++) {
      const left = currentCells[i - 1];
      const center = currentCells[i];
      const right = currentCells[i + 1];

      // Appliquer la règle de transition donnée
      const pattern = `${left}${center}${right}`;
      switch (pattern) {
        case '111':
          newCells[i] = 0;
          break;
        case '110':
          newCells[i] = 1;
          break;
        case '011':
          newCells[i] = 1;
          break;
        case '010':
          newCells[i] = 1;
          break;
        case '100':
          newCells[i] = 0;
          break;
        case '001':
          newCells[i] = 1;
          break;
        case '000':
          newCells[i] = 0;
          break;
        case '101':
          newCells[i] = 1;
          break;
        default:
          break;
      }
    }
    return newCells;
  };

  // Fonction pour avancer d'un pas dans la simulation
  const stepForward = () => {
    setCells((prevCells) => applyRule(prevCells));
  };

  // Fonction pour démarrer/arrêter la simulation
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // Fonction pour réinitialiser la grille à une configuration initiale
  const resetGrid = () => {
    const newCells = Array(99).fill(0);
    if (initialValue >= 0 && initialValue < 99) {
      newCells[initialValue] = 1;
    }
    setCells(newCells); // Remettre la cellule initiale activée
  };

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

  // Effect hook pour faire avancer la simulation automatiquement
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        stepForward();
      }, 500); // Avance de 1 étape toutes les 500ms
      return () => clearInterval(interval); // Nettoyage de l'intervalle lorsqu'on arrête la simulation
    }
  }, [isSimulating]);

  // Fonction pour modifier la cellule à une position spécifique
  const updateCell = (index, value) => {
    const newCells = [...cells];
    newCells[index] = value;
    setCells(newCells);
  };

  return (
      <div className="App">
        <h1>Automate Cellulaire 1D</h1>

        {/* Saisie de la valeur initiale */}
        <div className="input-container">
          <label>
            Cellule Initiale (0-98) :
            <input
                type="number"
                value={initialValue}
                min="0"
                max="98"
                onChange={(e) => setInitialValue(parseInt(e.target.value))}
            />
          </label>
          <button onClick={resetGrid}>Définir Initiale</button>
        </div>

        <div className="grid-container">
          <div className="grid">
            {cells.map((cell, index) => (
                <div
                    key={index}
                    className={`cell ${cell === 1 ? 'on' : 'off'}`}
                    onClick={() => updateCell(index, cell === 1 ? 0 : 1)} // Cliquer pour changer l'état de la cellule
                ></div>
            ))}
          </div>
        </div>

        <div className="Buttons">
          <button onClick={stepForward}>Step</button>
          {/* Bouton pour avancer d'une étape */}
          <button
              onClick={toggleSimulation}
              className={isSimulating ? 'stop' : 'simulate'}
          >
            {isSimulating ? 'Stop' : 'Simuler'}
          </button>
          {/* Bouton alternant entre "Simuler" et "Stop" */}

          <button
              onClick={() => setIsMusicOn(!isMusicOn)}
              className={isMusicOn ? 'stop' : 'simulate'}
          >
            {isMusicOn ? 'Musique Off' : 'Musique On'}
          </button>

          <button onClick={resetGrid}>Réinitialiser</button>
          {/* Bouton pour réinitialiser la grille */}
          <Link to="/game-of-life">
            <button>Accéder au Jeu de la Vie</button>
          </Link>
        </div>
      </div>
  );
}

export default App;
