import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DifficultySelector from "../components/DifficultySelector";

function Home() {
    const navigate = useNavigate();

    const [playerName, setPlayerName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [error, setError] = useState("");

    const startGame = () => {
        const cleanName = playerName.trim();

        if (!cleanName) {
            setError("Ingresa tu nombre antes de comenzar.");
            return;
        }

        setError("");

        const gameData = {
            player: cleanName,
            difficulty
        };

        sessionStorage.setItem(
            "currentGame",
            JSON.stringify(gameData)
        );

        navigate(`/juego/${difficulty}`, {
            state: gameData
        });
    };

    return (
        <main className="home">
            <div className="home-card">
                <h1>Video Game Trivia</h1>

                <p>
                    Pon a prueba tus conocimientos sobre videojuegos.
                </p>

                <label htmlFor="playerName">
                    Nombre del jugador
                </label>

                <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(event) =>
                        setPlayerName(event.target.value)
                    }
                    placeholder="Escribe tu nombre"
                    maxLength={30}
                />

                <h2>Selecciona la dificultad</h2>

                <DifficultySelector
                    value={difficulty}
                    onChange={setDifficulty}
                />

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="start-button"
                    onClick={startGame}
                >
                    Comenzar partida
                </button>
            </div>
        </main>
    );
}

export default Home;