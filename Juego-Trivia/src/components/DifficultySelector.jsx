function DifficultySelector({ value, onChange }) {
    const difficulties = [
        {
            id: "easy",
            name: "Fácil",
            questions: 10,
            time: 20
        },
        {
            id: "medium",
            name: "Media",
            questions: 12,
            time: 15
        },
        {
            id: "hard",
            name: "Difícil",
            questions: 15,
            time: 10
        }
    ];

    return (
        <div className="difficulty-selector">
            {difficulties.map((difficulty) => (
                <button
                    key={difficulty.id}
                    type="button"
                    className={
                        value === difficulty.id
                            ? "difficulty active"
                            : "difficulty"
                    }
                    onClick={() => onChange(difficulty.id)}
                >
                    <strong>{difficulty.name}</strong>
                    <span>
                        {difficulty.questions} preguntas
                    </span>
                    <small>
                        {difficulty.time} segundos por pregunta
                    </small>
                </button>
            ))}
        </div>
    );
}

export default DifficultySelector;