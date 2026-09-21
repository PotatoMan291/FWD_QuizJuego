import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const API_URL = "http://localhost:3001";

function Results() {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`${API_URL}/scores/${id}`);

        if (!response.ok) {
          throw new Error("Resultado no encontrado.");
        }

        const data = await response.json();

        setResult(data);
      } catch (err) {
        setError("No se pudo encontrar el resultado solicitado.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return <Loading message="Cargando resultado..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="results-page">
      <section className="result-card">
        <span className="eyebrow">RESULTADO #{result.id}</span>

        <h1>{result.player}</h1>

        <div className="final-score">
          <span>Puntaje final</span>
          <strong>{result.score}</strong>
        </div>

        <div className="result-stats">
          <div>
            <span>Correctas</span>
            <strong>
              {result.correctAnswers}/{result.totalQuestions}
            </strong>
          </div>

          <div>
            <span>Porcentaje</span>
            <strong>{result.percentage}%</strong>
          </div>

          <div>
            <span>Dificultad</span>
            <strong>{result.level}</strong>
          </div>
        </div>

        <div className="result-actions">
          <Link to="/" className="primary-button">
            Nueva partida
          </Link>

          <Link to="/leaderboard" className="secondary-button">
            Ver puntuaciones
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Results;