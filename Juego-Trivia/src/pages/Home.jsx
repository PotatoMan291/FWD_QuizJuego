import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";

function Home() {
  const [player, setPlayer] = useState("");
  const navigate = useNavigate();

  const handleStart = (level) => {
    const cleanName = player.trim();

    if (!cleanName) {
      alert("Debes escribir tu nombre antes de comenzar.");
      return;
    }

    sessionStorage.setItem("triviaPlayer", cleanName);
    navigate(`/game/${level}`);
  };

  return (
    <main className="home-page">
      <section className="hero">
        <span className="eyebrow">QUIZ #5 · VIDEOJUEGO</span>

        <h1>Game Trivia</h1>

        <p>
          Pon a prueba tus conocimientos sobre videojuegos, consigue puntos
          y alcanza un lugar en la tabla de puntuaciones.
        </p>

        <div className="player-form">
          <label htmlFor="player">Nombre del jugador</label>

          <input
            id="player"
            type="text"
            value={player}
            onChange={(event) => setPlayer(event.target.value)}
            placeholder="Escribe tu nombre"
            maxLength={30}
          />
        </div>
      </section>

      <section className="levels-section">
        <div className="section-heading">
          <span>SELECCIONA UNA DIFICULTAD</span>
          <h2>Elige tu desafío</h2>
        </div>

        <div className="game-grid">
          <GameCard
            level="easy"
            title="Novato"
            description="Preguntas generales para comenzar la partida."
            questions={5}
          />

          <GameCard
            level="medium"
            title="Veterano"
            description="Preguntas para jugadores con experiencia."
            questions={10}
          />

          <GameCard
            level="hard"
            title="Experto"
            description="Preguntas difíciles para verdaderos conocedores."
            questions={10}
          />
        </div>

        <div className="level-button-container">
          <button
            className="primary-button"
            onClick={() => handleStart("easy")}
          >
            Comenzar partida
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;