# FWD Quiz Juego

Proyecto de trivia de videojuegos desarrollado con React y Vite. La aplicación permite registrar el nombre de un jugador, seleccionar una dificultad, responder preguntas obtenidas desde JSON Server, calcular la puntuación y consultar un historial de resultados.

## Tecnologías

- React
- Vite
- React Router
- JSON Server
- n8n
- JavaScript

## Funcionalidades

- Selección de dificultad antes de iniciar la partida.
- Mayor cantidad de preguntas y menor tiempo de respuesta en dificultades superiores.
- Banco de 250 preguntas de videojuegos.
- Puntuación automática según respuestas correctas y dificultad.
- Guardado de resultados mediante JSON Server.
- Consulta de puntuaciones registradas.
- Integración con n8n mediante webhook para procesar el resultado de cada partida.
- Ruta dinámica para las partidas: `/juego/:difficulty`.

## Ejecución

Instalar dependencias:

```bash
npm install
```

Iniciar JSON Server:

```bash
npm run server
```

Iniciar la aplicación:

```bash
npm run dev
```

JSON Server utiliza el puerto `3001` y la aplicación React utiliza el puerto indicado por Vite.

## n8n

El proyecto incluye el workflow en `Juego-Trivia/n8n/videojuego-trivia-workflow.json`.

El webhook utilizado por React es:

```text
http://localhost:5678/webhook/videojuego-trivia
```

El workflow recibe el jugador, puntuación, aciertos, cantidad total de preguntas y nivel de dificultad. Después calcula el porcentaje y prepara una respuesta para el frontend.
