import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import ScoreBoard from "../components/ScoreBoard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const API_URL = "http://localhost:3001";
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/videojuego-trivia";

const QUESTIONS_BY_LEVEL = {
  easy: 5,
  medium: 10,
  hard: 10
};

function Game() {
  const { level } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [sendingResult, setSendingResult] = useState(false);

  const totalQuestions = questions.length;

  const correctAnswers = useMemo(() => {
    return Math.floor(score / 100);
  }, [score]);

  const percentage = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  useEffect(() => {
    const savedPlayer = sessionStorage.getItem("triviaPlayer");

    if (!savedPlayer) {
      navigate("/");
      return;
    }

    setPlayer(savedPlayer);
  }, [navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/questions?difficulty=${level}`
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener las preguntas.");
        }

        const data = await response.json();

        const numberOfQuestions = QUESTIONS_BY_LEVEL[level] || 5;

        const shuffledQuestions = [...data]
          .sort(() => Math.random() - 0.5)
          .slice(0, numberOfQuestions);

        setQuestions(shuffledQuestions);
      } catch (err) {
        setError(
          "No se pudieron cargar las preguntas. Verifica que json-server esté ejecutándose."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  useEffect(() => {
    if (lives <= 0 && questions.length > 0) {
      setGameFinished(true);
    }
  }, [lives, questions.length]);

  const handleAnswer = (answer) => {
    if (selectedAnswer || gameFinished) {
      return;
    }

    const question = questions[currentQuestion];

    setSelectedAnswer(answer);

    if (answer === question.correctAnswer) {
      setScore((previousScore) => previousScore + 100);
      setAnswerResult("correct");
    } else {
      setLives((previousLives) => previousLives - 1);
      setAnswerResult("incorrect");
    }

    setTimeout(() => {
      const isLastQuestion = currentQuestion === questions.length - 1;

      if (isLastQuestion) {
        setGameFinished(true);
        return;
      }

      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
      setSelectedAnswer("");
      setAnswerResult("");
    }, 900);
  };

  const saveScore = async () => {
    setSendingResult(true);
    setError("");

    const finalScore = {
      player,
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      level,
      date: new Date().toISOString()
    };

    try {
      const scoreResponse = await fetch(`${API_URL}/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalScore)
      });

      if (!scoreResponse.ok) {
        throw new Error("No se pudo guardar el puntaje.");
      }

      const savedScore = await scoreResponse.json();

      try {
        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...finalScore,
            scoreId: savedScore.id
          })
        });

        if (n8nResponse.ok) {
          const n8nData = await n8nResponse.json();

          sessionStorage.setItem(
            "triviaN8nResponse",
            JSON.stringify(n8nData)
          );
        }
      } catch (n8nError) {
        console.warn("No se pudo contactar con n8n:", n8nError);
      }

      navigate(`/results/${savedScore.id}`);
    } catch (err) {
      setError(
        "No se pudo guardar el resultado. Verifica que json-server esté funcionando."
      );
    } finally {
      setSendingResult(false);
    }
  };

  if (loading) {
    return <Loading message="Preparando la partida..." />;
  }

  if (error && questions.length === 0) {
    return <ErrorMessage message={error} />;
  }

  if (questions.length === 0) {
    return (
      <ErrorMessage message="No existen preguntas para esta dificultad." />
    );
  }

  if (gameFinished) {
    return (
      <main className="results-page">
        <section className="result-card">
          <span className="eyebrow">PARTIDA TERMINADA</span>

          <h1>Buen trabajo, {player}</h1>

          <div className="final-score">
            <span>Puntaje</span>
            <strong>{score}</strong>
          </div>

          <div className="result-stats">
            <div>
              <span>Correctas</span>
              <strong>
                {correctAnswers}/{totalQuestions}
              </strong>
            </div>

            <div>
              <span>Porcentaje</span>
              <strong>{percentage}%</strong>
            </div>

            <div>
              <span>Dificultad</span>
              <strong>{level}</strong>
            </div>
          </div>

          {error && <p className="inline-error">{error}</p>}

          <button
            className="primary-button"
            onClick={saveScore}
            disabled={sendingResult}
          >
            {sendingResult ? "Guardando resultado..." : "Guardar resultado"}
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  const question = questions[currentQuestion];

  return (
    <main className="game-page">
      <ScoreBoard
        player={player}
        score={score}
        lives={lives}
        currentQuestion={currentQuestion + 1}
        totalQuestions={totalQuestions}
      />

      <section className="game-container">
        <QuestionCard
          question={question}
          selectedAnswer={selectedAnswer}
          answerResult={answerResult}
          onAnswer={handleAnswer}
          disabled={Boolean(selectedAnswer)}
        />

        <div className="game-hint">
          Selecciona una respuesta. Las respuestas correctas otorgan 100
          puntos y las incorrectas quitan una vida.
        </div>
      </section>
    </main>
  );
}

export default Game;