import {
    useLocation,
    useNavigate
} from "react-router-dom";

function Results() {
    const location =
        useLocation();

    const navigate =
        useNavigate();

    const result =
        location.state ||
        JSON.parse(
            sessionStorage.getItem(
                "lastResult"
            ) || "null"
        );

    if (!result) {
        return (
            <main>
                <h1>
                    No hay resultados disponibles
                </h1>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Volver al inicio
                </button>
            </main>
        );
    }

    const difficultyNames = {
        easy: "Fácil",
        medium: "Media",
        hard: "Difícil"
    };

    return (
        <main className="results">
            <h1>
                Resultado de la partida
            </h1>

            <h2>
                {result.player}
            </h2>

            <p>
                Dificultad:{" "}
                {
                    difficultyNames[
                        result.difficulty
                    ]
                }
            </p>

            <p>
                Puntuación:{" "}
                <strong>
                    {result.score}
                </strong>
            </p>

            <p>
                Aciertos:{" "}
                <strong>
                    {
                        result.correctAnswers
                    }
                    /
                    {
                        result.totalQuestions
                    }
                </strong>
            </p>

            <p>
                Porcentaje:{" "}
                <strong>
                    {result.percentage}%
                </strong>
            </p>

            <div className="results-actions">
                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Nueva partida
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/puntajes"
                        )
                    }
                >
                    Ver puntuaciones
                </button>
            </div>
        </main>
    );
}

export default Results;