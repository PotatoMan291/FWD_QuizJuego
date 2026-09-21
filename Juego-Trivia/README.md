# Video Game Trivia

Aplicación web de trivia de videojuegos desarrollada con React y Vite. El jugador introduce su nombre, selecciona una dificultad y responde una serie de preguntas obtenidas mediante una API local con JSON Server.

La dificultad modifica la cantidad de preguntas, el tiempo disponible por pregunta y los puntos obtenidos por cada respuesta correcta.

## Dificultades

| Dificultad | Preguntas | Tiempo por pregunta | Puntos por acierto |
|---|---:|---:|---:|
| Fácil | 10 | 20 segundos | 100 |
| Media | 12 | 15 segundos | 150 |
| Difícil | 15 | 10 segundos | 200 |

## Tecnologías

- React
- Vite
- React Router
- JSON Server
- n8n
- JavaScript

## Estructura principal

```text
src/
├── components/
│   ├── DifficultySelector.jsx
│   ├── QuestionCard.jsx
│   └── Timer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Game.jsx
│   ├── Results.jsx
│   └── ScoreBoard.jsx
├── routes/
│   └── Routing.jsx
├── services/
│   └── gameService.js
├── App.jsx
└── main.jsx
```

## Instalación y ejecución

```bash
npm install
```

Iniciar JSON Server:

```bash
npm run server
```

Iniciar React:

```bash
npm run dev
```

JSON Server debe quedar disponible en `http://localhost:3001`.

## API local

Las preguntas se obtienen mediante:

```text
GET http://localhost:3001/questions
```

Los resultados se guardan mediante:

```text
POST http://localhost:3001/scores
```

## Integración con n8n

Al finalizar una partida, React envía el resultado al webhook de n8n:

```text
POST http://localhost:5678/webhook/videojuego-trivia
```

El workflow valida los datos, calcula el porcentaje, determina el rendimiento y devuelve una respuesta JSON.
