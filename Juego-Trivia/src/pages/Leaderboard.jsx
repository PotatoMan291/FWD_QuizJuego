import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const API_URL = "http://localhost:3001";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/scores?_sort=score&_order=desc`
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener las puntuaciones.");
        }

        const data = await response.json();

        setScores(data);
      } catch (err) {
        setError(
          "No se pudieron cargar las puntuaciones. Verifica que json-server esté funcionando."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return <Loading message="Cargando puntuaciones..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="leaderboard-page">
      <section className="section-heading centered">
        <span>LEADERBOARD</span>
        <h1>Tabla de puntuaciones</h1>
        <p>
          Consulta los resultados registrados por los jugadores.
        </p>
      </section>

      {scores.length === 0 ? (
        <div className="empty-state">
          <h2>Aún no hay puntuaciones</h2>
          <p>Completa una partida para aparecer en la tabla.</p>

          <Link to="/" className="primary-button">
            Jugar ahora
          </Link>
        </div>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Dificultad</th>
                <th>Puntos</th>
                <th>Resultado</th>
              </tr>
            </thead>

            <tbody>
              {scores.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.player}</td>
                  <td>{item.level}</td>
                  <td className="table-score">{item.score}</td>
                  <td>{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Leaderboard;