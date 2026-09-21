import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";

import {
    getQuestions,
    saveScore,
    sendResultToN8n
} from "../services/gameService";

const DIFFICULTY_CONFIG = {
    easy: {
        name: "Fácil",
        questionCount: 10,
        secondsPerQuestion: 20,
        pointsPerCorrect: 100
    },

    medium: {
        name: "Media",
        questionCount: 12,
        secondsPerQuestion: 15,
        pointsPerCorrect: 150
    },

    hard: {
        name: "Difícil",
        questionCount: 15,
        secondsPerQuestion: 10,
        pointsPerCorrect: 200
    }
};

function shuffle(array) {
    return [...array].sort(
        () => Math.random() - 0.5
    );
}

function Game() {
    const { difficulty } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const config = useMemo(
        () =>
            DIFFICULTY_CONFIG[difficulty] ||
            DIFFICULTY_CONFIG.easy,
        [difficulty]
    );

    const [player, setPlayer] = useState(
        location.state?.player || ""
    );

    const [questions, setQuestions] = useState([]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState("");

    const [answerResult, setAnswerResult] =
        useState(null);

    const [correctAnswers, setCorrectAnswers] =
        useState(0);

    const [timeLeft, setTimeLeft] = useState(
        config.secondsPerQuestion
    );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [finishing, setFinishing] =
        useState(false);

    /*
     * Obtener jugador actual
     */
    useEffect(() => {
        if (location.state?.player) {
            setPlayer(location.state.player);
            return;
        }

        const savedGame =
            sessionStorage.getItem("currentGame");

        if (savedGame) {
            const parsedGame =
                JSON.parse(savedGame);

            if (
                parsedGame.difficulty ===
                difficulty
            ) {
                setPlayer(parsedGame.player);
                return;
            }
        }

        navigate("/");
    }, [
        location.state,
        difficulty,
        navigate
    ]);

    /*
     * Obtener preguntas
     */
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getQuestions();

                const filtered =
                    data.filter(
                        (question) =>
                            question.difficulty ===
                            difficulty
                    );

                if (
                    filtered.length <
                    config.questionCount
                ) {
                    throw new Error(
                        `No hay suficientes preguntas de dificultad ${config.name}.`
                    );
                }

                const selectedQuestions =
                    shuffle(filtered).slice(
                        0,
                        config.questionCount
                    );

                setQuestions(
                    selectedQuestions
                );
            } catch (loadError) {
                setError(
                    loadError.message
                );
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [
        difficulty,
        config
    ]);

    /*
     * Reiniciar temporizador
     * cuando cambia la pregunta.
     */
    useEffect(() => {
        setTimeLeft(
            config.secondsPerQuestion
        );
    }, [
        currentIndex,
        config.secondsPerQuestion
    ]);

    /*
     * Temporizador
     */
    useEffect(() => {
        if (
            loading ||
            finishing ||
            !questions.length ||
            selectedAnswer
        ) {
            return;
        }

        if (timeLeft <= 0) {
            return;
        }

        const timer =
            setTimeout(() => {
                setTimeLeft(
                    (previous) =>
                        previous - 1
                );
            }, 1000);

        return () =>
            clearTimeout(timer);

    }, [
        timeLeft,
        loading,
        finishing,
        questions.length,
        selectedAnswer
    ]);

    /*
     * Finalizar partida
     */
    const finishGame = useCallback(
        async (
            finalCorrectAnswers
        ) => {
            if (finishing) {
                return;
            }

            setFinishing(true);

            const totalQuestions =
                questions.length;

            const percentage =
                totalQuestions > 0
                    ? Math.round(
                        (
                            finalCorrectAnswers /
                            totalQuestions
                        ) * 100
                    )
                    : 0;

            const score =
                finalCorrectAnswers *
                config.pointsPerCorrect;

            const result = {
                player,
                score,
                correctAnswers:
                    finalCorrectAnswers,
                totalQuestions,
                percentage,
                difficulty,
                level: difficulty,
                date:
                    new Date().toISOString()
            };

            try {
                /*
                 * Guardar en JSON Server
                 */
                await saveScore(result);

                /*
                 * Enviar a n8n
                 */
                try {
                    await sendResultToN8n(
                        result
                    );
                } catch (n8nError) {
                    console.warn(
                        "La puntuación se guardó, pero n8n no respondió:",
                        n8nError
                    );
                }

                /*
                 * Guardar último resultado
                 */
                sessionStorage.setItem(
                    "lastResult",
                    JSON.stringify(result)
                );

                /*
                 * Eliminar partida actual
                 */
                sessionStorage.removeItem(
                    "currentGame"
                );

                /*
                 * Ir a resultados
                 */
                navigate(
                    "/resultados",
                    {
                        state: result,
                        replace: true
                    }
                );

            } catch (saveError) {
                setError(
                    saveError.message
                );

                setFinishing(false);
            }
        },
        [
            finishing,
            questions.length,
            config.pointsPerCorrect,
            player,
            difficulty,
            navigate
        ]
    );

    /*
     * Cuando se acaba el tiempo
     */
    const handleTimeUp =
        useCallback(() => {
            if (finishing) {
                return;
            }

            const isLastQuestion =
                currentIndex ===
                questions.length - 1;

            /*
             * Si se acabó el tiempo
             * y era la última pregunta,
             * terminamos la partida.
             */
            if (isLastQuestion) {
                finishGame(
                    correctAnswers
                );

                return;
            }

            /*
             * Pasar a siguiente pregunta.
             *
             * Como no respondió,
             * no se suma ningún punto.
             */
            setCurrentIndex(
                (previous) =>
                    previous + 1
            );

            setSelectedAnswer("");
            setAnswerResult(null);

        }, [
            finishing,
            currentIndex,
            questions.length,
            finishGame,
            correctAnswers
        ]);

    /*
     * Cuando el jugador selecciona una respuesta
     */
    const handleAnswer = (
        answer
    ) => {
        /*
         * Evitar seleccionar
         * dos respuestas.
         */
        if (
            selectedAnswer ||
            finishing
        ) {
            return;
        }

        const currentQuestion =
            questions[currentIndex];

        /*
         * Comprobar respuesta
         */
        const isCorrect =
            answer ===
            currentQuestion.answer;

        /*
         * Mostrar inmediatamente
         * la respuesta seleccionada.
         */
        setSelectedAnswer(answer);

        /*
         * Guardar si fue correcta
         * o incorrecta.
         */
        setAnswerResult(
            isCorrect
        );

        /*
         * Calcular correctamente
         * las respuestas acertadas.
         */
        const newCorrectAnswers =
            isCorrect
                ? correctAnswers + 1
                : correctAnswers;

        if (isCorrect) {
            setCorrectAnswers(
                newCorrectAnswers
            );
        }

        /*
         * Esperar para que el jugador
         * pueda ver el resultado.
         */
        setTimeout(() => {
            const isLastQuestion =
                currentIndex ===
                questions.length - 1;

            /*
             * Si es la última pregunta,
             * terminar partida.
             */
            if (isLastQuestion) {
                finishGame(
                    newCorrectAnswers
                );

                return;
            }

            /*
             * Pasar a siguiente pregunta.
             */
            setCurrentIndex(
                (previous) =>
                    previous + 1
            );

            setSelectedAnswer("");
            setAnswerResult(null);

        }, 1200);
    };

    /*
     * Pantalla de carga
     */
    if (loading) {
        return (
            <p>
                Cargando preguntas...
            </p>
        );
    }

    /*
     * Error
     */
    if (error) {
        return (
            <div>
                <p>{error}</p>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    /*
     * Sin preguntas
     */
    if (!questions.length) {
        return (
            <p>
                No hay preguntas disponibles.
            </p>
        );
    }

    const currentQuestion =
        questions[currentIndex];

    return (
        <main className="game">
            <header className="game-header">

                <div>
                    <span>
                        Jugador
                    </span>

                    <strong>
                        {player}
                    </strong>
                </div>

                <div>
                    <span>
                        Dificultad
                    </span>

                    <strong>
                        {config.name}
                    </strong>
                </div>

                <div>
                    <span>
                        Pregunta
                    </span>

                    <strong>
                        {currentIndex + 1}
                        /
                        {questions.length}
                    </strong>
                </div>

                <Timer
                    timeLeft={timeLeft}
                    onTimeUp={handleTimeUp}
                />

            </header>

            <QuestionCard
                question={
                    currentQuestion
                }
                selectedAnswer={
                    selectedAnswer
                }
                answerResult={
                    answerResult
                }
                onSelectAnswer={
                    handleAnswer
                }
                disabled={
                    Boolean(
                        selectedAnswer
                    ) || finishing
                }
            />

            <div className="game-progress">

                <div
                    className="game-progress-bar"
                    style={{
                        width:
                            `${
                                (
                                    (currentIndex + 1) /
                                    questions.length
                                ) * 100
                            }%`
                    }}
                />

            </div>
        </main>
    );
}

export default Game;