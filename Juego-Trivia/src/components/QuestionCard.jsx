function QuestionCard({
    question,
    selectedAnswer,
    answerResult,
    onSelectAnswer,
    disabled
}) {
    const hasAnswered = Boolean(selectedAnswer);

    return (
        <section className="question-card">
            <p className="question-category">
                {question.category}
            </p>

            <h2>{question.question}</h2>

            <div className="answer-list">
                {question.options.map((option) => {
                    const isSelected =
                        selectedAnswer === option;

                    const isCorrect =
                        question.answer === option;

                    let answerClass = "answer";

                    /*
                     * Si ya respondió:
                     * - La respuesta correcta siempre se pinta de verde.
                     * - La respuesta seleccionada incorrecta se pinta de rojo.
                     */
                    if (hasAnswered && isCorrect) {
                        answerClass += " correct";
                    }

                    if (
                        hasAnswered &&
                        isSelected &&
                        !isCorrect
                    ) {
                        answerClass += " incorrect";
                    }

                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={disabled}
                            className={answerClass}
                            onClick={() =>
                                onSelectAnswer(option)
                            }
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {answerResult === true && (
                <div className="answer-feedback correct-feedback">
                    <strong>Respuesta correcta</strong>
                    <span>
                        ¡Muy bien! Has elegido la respuesta correcta.
                    </span>
                </div>
            )}

            {answerResult === false && (
                <div className="answer-feedback incorrect-feedback">
                    <strong>Respuesta incorrecta</strong>

                    <span>
                        La respuesta correcta es:
                    </span>

                    <strong className="correct-answer-text">
                        {question.answer}
                    </strong>
                </div>
            )}
        </section>
    );
}

export default QuestionCard;