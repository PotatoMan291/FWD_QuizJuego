import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

const API_URL =
    "http://localhost:3001";

const difficultyNames = {
    easy: "Fácil",
    medium: "Media",
    hard: "Difícil"
};

function ScoreBoard() {
    const [scores, setScores] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadScores =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await fetch(
                            `${API_URL}/scores`
                        );

                    if (!response.ok) {
                        throw new Error(
                            "No se pudieron obtener las puntuaciones."
                        );
                    }

                    const data =
                        await response.json();

                    const orderedScores =
                        [...data].sort(
                            (a, b) =>
                                Number(
                                    b.score
                                ) -
                                Number(
                                    a.score
                                )
                        );

                    setScores(
                        orderedScores
                    );
                } catch (
                    loadError
                ) {
                    setError(
                        loadError.message
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadScores();
    }, []);

    return (
        <main className="scoreboard">
            <h1>
                Puntuaciones
            </h1>

            <p>
                Historial de partidas
            </p>

            {loading && (
                <p>
                    Cargando puntuaciones...
                </p>
            )}

            {error && (
                <div>
                    <p>
                        {error}
                    </p>

                    <p>
                        Verifica que
                        JSON Server esté
                        ejecutándose en
                        http://localhost:3001
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                scores.length === 0 && (
                    <p>
                        Todavía no hay
                        puntuaciones
                        registradas.
                    </p>
                )}

            {!loading &&
                !error &&
                scores.length > 0 && (
                    <div className="score-table-wrapper">
                        <table className="score-table">
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Jugador
                                    </th>

                                    <th>
                                        Puntos
                                    </th>

                                    <th>
                                        Aciertos
                                    </th>

                                    <th>
                                        Porcentaje
                                    </th>

                                    <th>
                                        Dificultad
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {scores.map(
                                    (
                                        score,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                score.id
                                            }
                                        >
                                            <td>
                                                {
                                                    index +
                                                    1
                                                }
                                            </td>

                                            <td>
                                                {
                                                    score.player
                                                }
                                            </td>

                                            <td>
                                                {
                                                    score.score
                                                }
                                            </td>

                                            <td>
                                                {
                                                    score.correctAnswers
                                                }
                                                /
                                                {
                                                    score.totalQuestions
                                                }
                                            </td>

                                            <td>
                                                {
                                                    score.percentage
                                                }%
                                            </td>

                                            <td>
                                                {
                                                    difficultyNames[
                                                        score.difficulty
                                                    ] ||
                                                    score.difficulty
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}

export default ScoreBoard;