const API_URL =
    "http://localhost:3001";

const N8N_WEBHOOK_URL =
    "http://localhost:5678/webhook/videojuego-trivia";

export async function getQuestions() {
    const response =
        await fetch(
            `${API_URL}/questions`
        );

    if (!response.ok) {
        throw new Error(
            "No se pudieron obtener las preguntas."
        );
    }

    return response.json();
}

export async function saveScore(
    scoreData
) {
    const response =
        await fetch(
            `${API_URL}/scores`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        scoreData
                    )
            }
        );

    if (!response.ok) {
        throw new Error(
            "No se pudo guardar la puntuación."
        );
    }

    return response.json();
}

export async function sendResultToN8n(
    resultData
) {
    const response =
        await fetch(
            N8N_WEBHOOK_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        player:
                            resultData.player,

                        score:
                            resultData.score,

                        correctAnswers:
                            resultData.correctAnswers,

                        totalQuestions:
                            resultData.totalQuestions,

                        level:
                            resultData.difficulty
                    })
            }
        );

    if (!response.ok) {
        throw new Error(
            "No se pudo comunicar con n8n."
        );
    }

    return response.json();
}