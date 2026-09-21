import AnswerButton from "./AnswerButton";

function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  answerResult,
  disabled
}) {
  return (
    <section className="question-card">
      <div className="question-category">
        {question.category} · {question.difficulty}
      </div>

      <h2>{question.question}</h2>

      <div className="answers-grid">
        {question.options.map((option) => (
          <AnswerButton
            key={option}
            option={option}
            onClick={onAnswer}
            disabled={disabled}
            selected={selectedAnswer === option}
            correct={
              answerResult === "correct" &&
              option === question.correctAnswer
            }
            incorrect={
              answerResult === "incorrect" &&
              option === selectedAnswer
            }
          />
        ))}
      </div>
    </section>
  );
}

export default QuestionCard;