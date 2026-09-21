# Workflow n8n - Game Trivia

Este workflow procesa el resultado final de una partida del videojuego Game Trivia.

## Flujo

Webhook
↓
Validar datos
↓
Calcular estadísticas
↓
¿Buen resultado?
↓
Preparar respuesta
↓
Responder al frontend

## Webhook

Método:

POST

URL local:

http://localhost:5678/webhook/videojuego-trivia

## Datos recibidos

```json
{
  "player": "Saxthor",
  "score": 800,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "level": "medium"
}
```
