function ScoreBoard({
  player,
  score,
  lives,
  currentQuestion,
  totalQuestions
}) {
  return (
    <div className="score-board">
      <div>
        <span className="score-label">Jugador</span>
        <strong>{player}</strong>
      </div>

      <div>
        <span className="score-label">Pregunta</span>
        <strong>
          {currentQuestion}/{totalQuestions}
        </strong>
      </div>

      <div>
        <span className="score-label">Puntos</span>
        <strong>{score}</strong>
      </div>

      <div>
        <span className="score-label">Vidas</span>
        <strong className="lives">
          {"♥".repeat(lives)}
          {"♡".repeat(3 - lives)}
        </strong>
      </div>
    </div>
  );
}

export default ScoreBoard;