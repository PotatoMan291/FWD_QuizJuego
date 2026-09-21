import { Link } from "react-router-dom";

function GameCard({ level, title, description, questions }) {
  return (
    <article className="game-card">
      <span className={`difficulty-badge ${level}`}>
        {level.toUpperCase()}
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="question-count">
        {questions} preguntas disponibles
      </span>

      <Link to={`/game/${level}`} className="primary-button">
        Jugar
      </Link>
    </article>
  );
}

export default GameCard;